using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using TheCoil.Mediation.Users.Commands.ChangePassword;
using TheCoil.Mediation.Users.Commands.SendEmailVerification;
using TheCoil.Mediation.Users.Commands.SendPasswordChangeVerification;
using TheCoil.Mediation.Users.Commands.SignIn;
using TheCoil.Mediation.Users.Commands.SignUp;
using TheCoil.Mediation.Users.Commands.VerifyEmail;

namespace TheCoil.Api.Controllers
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
        public async Task<IActionResult> SignInAsync([FromBody]SignInCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpDelete("signout")]
        public IActionResult SignOut()
        {
            Response.Cookies.Delete("Authorization");
            return NoContent();
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUpAsync([FromBody]SignUpCommand model)
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
        public async Task<IActionResult> SendEmailVerificationTokenCommandAsync([FromBody]SendEmailVerificationByEmailCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody]ChangePasswordCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("send-change-password")]
        public async Task<IActionResult> SendChangePasswordAsync([FromBody]SendPasswordChangeVerificationCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }
    }
}