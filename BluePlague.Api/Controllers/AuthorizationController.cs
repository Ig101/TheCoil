using System.Threading.Tasks;
using BluePlague.Mediation.Users.Commands.LogIn;
using BluePlague.Mediation.Users.Commands.Register;
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

        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody]LogInCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody]RegisterCommand model)
        {
            await Mediator.Send(model);
            return NoContent();
        }
    }
}