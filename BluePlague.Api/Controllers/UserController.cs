using BluePlague.Mediation.Users.Queries.GetActiveUser;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BluePlague.Api.Controllers
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
    public IActionResult GetActiveUser()
    {
        return Ok(Mediator.Send(new GetActiveUserQuery()
        {
            UserName = User.Identity.Name
        }));
    }
  }
}