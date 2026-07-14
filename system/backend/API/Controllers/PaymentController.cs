using Microsoft.AspNetCore.Mvc;
using Stripe;
using Toros.Backend.DTOs;
using Toros.Backend.Interfaces;

namespace Toros.Backend.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IConfiguration configuration, IUserService userService, ILogger<PaymentController> logger)
    {
        _configuration = configuration;
        _userService = userService;
        _logger = logger;
        StripeConfiguration.ApiKey = _configuration["Stripe:SecretKey"];
    }

    [HttpPost("create-intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromHeader(Name = "X-User-Id")] string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return BadRequest("User ID required");

        var options = new PaymentIntentCreateOptions
        {
            Amount = 1099, // $10.99
            Currency = "usd",
            Metadata = new Dictionary<string, string> { { "userId", userId } },
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);

        return Ok(new CreatePaymentIntentResponse
        {
            ClientSecret = paymentIntent.ClientSecret,
            PublishableKey = _configuration["Stripe:PublishableKey"]
        });
    }

    [HttpPost("webhook")]
    public async Task<IActionResult> Webhook()
    {
        var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
        try
        {
            var stripeEvent = EventUtility.ConstructEvent(json,
                Request.Headers["Stripe-Signature"], _configuration["Stripe:WebhookSecret"]);

            if (stripeEvent.Type == EventTypes.PaymentIntentSucceeded)
            {
                var paymentIntent = stripeEvent.Data.Object as PaymentIntent;
                _logger.LogInformation($"PaymentIntent Succeeded: {paymentIntent.Id}");
                
                if (paymentIntent.Metadata.TryGetValue("userId", out var userId))
                {
                    await _userService.UpgradeToDirectorAsync(userId);
                    _logger.LogInformation($"User {userId} upgraded to Director");
                }
            }

            return Ok();
        }
        catch (StripeException e)
        {
            _logger.LogError(e, "Webhook error");
            return BadRequest();
        }
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request, [FromHeader(Name = "X-User-Id")] string? userId)
    {
        if (string.IsNullOrEmpty(userId)) return BadRequest("User ID required");

        try 
        {
            var service = new PaymentIntentService();
            var intent = await service.GetAsync(request.PaymentIntentId);

            if (intent.Status == "succeeded")
            {
                await _userService.UpgradeToDirectorAsync(userId);
                return Ok(new { success = true });
            }

            return BadRequest(new { success = false, status = intent.Status });
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Verification error");
            return StatusCode(500, "Error verifying payment");
        }
    }
}
