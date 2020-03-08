using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Game;

namespace TheCoil.Mediation.Game.Commands.SurrenderGame
{
    public class SurrenderAllGamesCommand : IRequest
    {
        public string UserName { get; set; }

        internal class Handler : IRequestHandler<SurrenderAllGamesCommand>
        {
            private readonly GameContext _gameContext;

            public Handler(
                GameContext gameContext)
            {
                _gameContext = gameContext;
            }

            public async Task<Unit> Handle(SurrenderAllGamesCommand request, CancellationToken cancellationToken)
            {
                var gameIds = await _gameContext.GameMeta.GetAsync(x => x.UserName == request.UserName, x => x.Id, cancellationToken);

                _gameContext.GameMeta.Delete(x => x.UserName == request.UserName);
                _gameContext.SceneSegments.Delete(x => gameIds.Contains(x.Id));
                await _gameContext.ApplyChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}