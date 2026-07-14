namespace Toros.Backend.DTOs;

public class CreatePaymentIntentResponse
{
    public string ClientSecret { get; set; } = string.Empty;
    public string PublishableKey { get; set; } = string.Empty;
}

public class VerifyPaymentRequest
{
    public string PaymentIntentId { get; set; } = string.Empty;
}
