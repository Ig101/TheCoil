using BluePlague.Domain.Game;
using Microsoft.AspNetCore.Mvc;

namespace BluePlague.Api.Controllers
{
    [Route("api/game")]
    [ApiController]
    public class GameController: ControllerBase
    {
        public GameController(GameContext gameContext) {

        }

        [HttpGet]
        public IActionResult Get() {
            return Ok();
        }

    }
}