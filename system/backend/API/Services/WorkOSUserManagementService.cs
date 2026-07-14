using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Toros.Backend.Services;

public class WorkOSUserManagementService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private readonly string _clientId;

    public WorkOSUserManagementService(IConfiguration configuration, HttpClient httpClient)
    {
        _httpClient = httpClient;
        _apiKey = configuration["WorkOS:ApiKey"];
        _clientId = configuration["WorkOS:ClientId"] ?? "";

        _httpClient.BaseAddress = new Uri("https://api.workos.com/");
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
    }

    public string GetAuthorizationUrl(string redirectUri, string? state = null)
    {
        var url = $"https://api.workos.com/user_management/authorize?response_type=code&client_id={_clientId}&redirect_uri={Uri.EscapeDataString(redirectUri)}&provider=authkit";
        if (!string.IsNullOrEmpty(state))
        {
            url += $"&state={Uri.EscapeDataString(state)}";
        }
        return url;
    }

    public async Task<WorkOSUser?> GetUser(string id)
    {
        try 
        {
            var response = await _httpClient.GetAsync($"user_management/users/{id}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<WorkOSUser>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
        catch { return null; }
    }

    public async Task<WorkOSUser?> SearchUserByEmail(string email)
    {
        try 
        {
            // WorkOS API: GET /user_management/users?email=<email>
            var response = await _httpClient.GetAsync($"user_management/users?email={Uri.EscapeDataString(email)}");
            if (!response.IsSuccessStatusCode) return null;

            var json = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<WorkOSUserListResponse>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            
            // Return first matching user
            return result?.Data?.FirstOrDefault();
        }
        catch { return null; }
    }

    public async Task<WorkOSUser> CreateUser(string email, string password, string firstName, string lastName)
    {
        var response = await _httpClient.PostAsJsonAsync("user_management/users", new
        {
            email,
            password,
            first_name = firstName,
            last_name = lastName,
            email_verified = true
        });

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"WorkOS Create User Failed: {response.StatusCode} - {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<WorkOSUser>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
    }

    public async Task<WorkOSSSOResponse> GetProfileAndToken(string code, string redirectUri)
    {
        var response = await _httpClient.PostAsJsonAsync("user_management/authenticate", new
        {
            client_id = _clientId,
            client_secret = _apiKey,
            code,
            redirect_uri = redirectUri,
            grant_type = "authorization_code"
        });

        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync();
            throw new Exception($"WorkOS SSO Token Exchange Failed: {response.StatusCode} - {error}");
        }

        var json = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<WorkOSSSOResponseInternal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
        
        return new WorkOSSSOResponse
        {
            AccessToken = result.AccessToken,
            Profile = result.User
        };
    }

    private class WorkOSSSOResponseInternal
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; } = "";
        [JsonPropertyName("user")]
        public WorkOSUser User { get; set; } = new();
    }
}

public class WorkOSUser
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    [JsonPropertyName("first_name")]
    public string FirstName { get; set; } = string.Empty;
    [JsonPropertyName("last_name")]
    public string LastName { get; set; } = string.Empty;
    [JsonPropertyName("profile_picture_url")]
    public string? ProfilePictureUrl { get; set; }
}

public class WorkOSSSOResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public WorkOSUser Profile { get; set; } = new();
}

public class WorkOSUserListResponse
{
    public List<WorkOSUser> Data { get; set; } = new();
}
