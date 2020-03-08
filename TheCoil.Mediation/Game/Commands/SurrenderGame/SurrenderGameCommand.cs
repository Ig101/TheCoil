using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Game;
using TheCoil.Infrastructure.Models.ErrorHandling;

namespace TheCoil.Mediation.Game.Commands.SurrenderGame
{
    public class SurrenderGameCommand : IRequest
    {
        public Guid GameId { get; set; }

        public string UserName { get; set; }

        internal class Handler : IRequestHandler<SurrenderGameCommand>
        {
            private readonly GameContext _gameContext;

            public Handler(
                GameContext gameContext)
            {
                _gameContext = gameContext;
            }

            public async Task<Unit> Handle(SurrenderGameCommand request, CancellationToken cancellationToken)
            {
                var check = await _gameContext.GameMeta.GetOneAsync(
                    x => x.Id == request.GameId && x.UserName == request.UserName,
                    x => (Guid?)x.Id,
                    cancellationToken);
                if (check == null)
                {
                    throw new HttpException()
                    {
                        StatusCode = 404,
                        Error = "Game is not found."
                    };
                }

                _gameContext.GameMeta.Delete(x => x.Id == request.GameId);
                _gameContext.SceneSegments.Delete(x => x.GameId == request.GameId);
                await _gameContext.ApplyChangesAsync(cancellationToken);

                return Unit.Value;
            }
        }
    }
}