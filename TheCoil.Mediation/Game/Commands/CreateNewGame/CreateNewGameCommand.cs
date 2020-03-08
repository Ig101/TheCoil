using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Game;
using TheCoil.Domain.Game.Entities;
using TheCoil.Domain.Game.EntityModels;
using TheCoil.Infrastructure.Enums;
using TheCoil.Mediation.Game.Commands.GenerateNewSegment;
using TheCoil.Mediation.Helpers;

namespace TheCoil.Mediation.Game.Commands.CreateNewGame
{
    public class CreateNewGameCommand : IRequest
    {
        public string PlayerName { get; set; }

        public string UserName { get; set; }

        public class Handler : IRequestHandler<CreateNewGameCommand>
        {
            private readonly GameContext _gameContext;
            private readonly IMediator _mediator;

            public Handler(
                GameContext gameContext,
                IMediator mediator)
            {
                _gameContext = gameContext;
                _mediator = mediator;
            }

            public async Task<Unit> Handle(CreateNewGameCommand request, CancellationToken cancellationToken)
            {
                var random = new Random();
                var gameMeta = new GameMeta()
                {
                    Id = Guid.NewGuid(),
                    UserName = request.UserName,
                    Session = Guid.NewGuid().ToString(),
                    Incrementor = 2,
                    Width = Consts.MapWidth,
                    Height = Consts.MapHeight,
                    Turn = 0,
                    GameState = GameState.Pending,
                    PlayerScene = Consts.InitialSceneId,
                    StartDate = DateTime.Now,
                    LastDate = DateTime.Now,
                    PlayerActor = new Actor()
                    {
                        Id = 1,
                        X = Consts.PlayerInitialX,
                        Y = Consts.PlayerInitialY,
                        Name = request.PlayerName,
                        NativeId = Consts.PlayerNativeId
                    }
                };
                _gameContext.GameMeta.InsertOne(gameMeta);
                var sceneSegment = await _mediator.Send(new GenerateNewSegmentCommand()
                {
                    GameId = gameMeta.Id,
                    SceneId = Consts.InitialSceneId,
                    Seed = random.Next()
                });
                _gameContext.SceneSegments.InsertOne(sceneSegment);
                await _gameContext.ApplyChangesAsync(cancellationToken);
                return Unit.Value;
            }
        }
    }
}