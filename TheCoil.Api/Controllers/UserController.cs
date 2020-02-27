using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheCoil.Mediation.Users.Queries.GetActiveUser;

namespace TheCoil.Api.Controllers
{
  [ApiController]
  [Route("api/user")]
  public class UserController : MediatorControllerBase
  {
    public UserController(IMediator mediator)
        : base(mediator)
    {
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetActiveUserAsync()
    {
        return Ok(await Mediator.Send(new GetActiveUserQuery()
        {
            UserName = User.Identity.Name
        }));
    }
  }
}