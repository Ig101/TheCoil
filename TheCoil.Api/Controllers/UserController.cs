using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheCoil.Mediation.Users.Commands.ChangePassword;
using TheCoil.Mediation.Users.Queries.GetActiveUser;

namespace TheCoil.Api.Controllers
{
  [Authorize]
  [ApiController]
  [Route("api/user")]
  public class UserController : MediatorControllerBase
  {
    public UserController(IMediator mediator)
        : base(mediator)
    {
    }

    [HttpGet]
    public async Task<IActionResult> GetActiveUserAsync()
    {
        return Ok(await Mediator.Send(new GetActiveUserQuery()
        {
            UserName = User.Identity.Name
        }));
    }

    [HttpPut("password")]
    public async Task<IActionResult> ChangePasswordAsync(ChangePasswordAuthorizedCommand model)
    {
      model.UserName = User.Identity.Name;
      await Mediator.Send(model);
      return NoContent();
    }
  }
}