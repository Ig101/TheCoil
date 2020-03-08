using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Game;
using TheCoil.Infrastructure.Models.Game;

namespace TheCoil.Mediation.Game.Queries.GetPlayerGamesStatus
{
    public class GetPlayerGamesStatusQuery : IRequest<IEnumerable<GameStatusDto>>
    {
        public string UserName { get; set; }

        internal class Handler : IRequestHandler<GetPlayerGamesStatusQuery, IEnumerable<GameStatusDto>>
        {
            private readonly GameContext _gameContext;

            public Handler(
                GameContext gameContext)
            {
                _gameContext = gameContext;
            }

            public async Task<IEnumerable<GameStatusDto>> Handle(GetPlayerGamesStatusQuery request, CancellationToken cancellationToken)
            {
                return await _gameContext.GameMeta.GetAsync(
                    x => x.UserName == request.UserName,
                    x => new GameStatusDto()
                    {
                        GameId = x.Id,
                        PlayerName = x.PlayerActor.Name
                    }, cancellationToken);
            }
        }
    }
}