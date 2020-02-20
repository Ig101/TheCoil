using System.Threading.Tasks;
using BluePlague.Mediation.Users.Commands.SendEmailVerificationToken;
using BluePlague.Mediation.Users.Commands.SignIn;
using BluePlague.Mediation.Users.Commands.SignUp;
using BluePlague.Mediation.Users.Commands.VerifyEmail;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BluePlague.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthorizationController : MediatorControllerBase
    {
        public AuthorizationController(IMediator mediator)
                : base(mediator)
        {
        }

        [HttpPost("signin")]
        public async Task<IActionResult> LoginAsync([FromBody]SignInCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("signup")]
        public async Task<IActionResult> RegisterAsync([FromBody]SignUpCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyEmailAsync([FromBody]VerifyEmailCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("send-verification")]
        public async Task<IActionResult> SendEmailVerificationTokenCommandAsync([FromBody]SendEmailVerificationTokenCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }
    }
}