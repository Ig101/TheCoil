using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MongoDB.Driver;
using TheCoil.Domain.Game;
using TheCoil.Domain.Game.Entities;
using TheCoil.Infrastructure.Models.ErrorHandling;
using TheCoil.Infrastructure.Models.Game;
using TheCoil.Mediation.Game.Commands.GenerateNewSegment;

namespace TheCoil.Mediation.Game.Queries.GetPlayerGameSavedData
{
    public class GetPlayerGameSavedDataQuery : IRequest<FullGameStateDto>
    {
        public Guid GameId { get; set; }

        public string UserName { get; set; }

        internal class Handler : IRequestHandler<GetPlayerGameSavedDataQuery, FullGameStateDto>
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

            public async Task<FullGameStateDto> Handle(GetPlayerGameSavedDataQuery request, CancellationToken cancellationToken)
            {
                var gameState = await _gameContext.GameMeta.GetOneAsync(x => x.Id == request.GameId && x.UserName == request.UserName, cancellationToken);
                if (gameState == null)
                {
                    throw new HttpException()
                    {
                        StatusCode = 404,
                        Error = "Game is not found."
                    };
                }

                var currentPlayerScene = await _gameContext.SceneSegments.GetOneAsync(
                    x => x.GameId == request.GameId && x.SceneId == gameState.PlayerScene, cancellationToken);
                if (currentPlayerScene == null)
                {
                    _gameContext.GameMeta.Delete(x => x.Id == request.GameId);
                    _gameContext.SceneSegments.Delete(x => x.GameId == request.GameId);
                    await _gameContext.ApplyChangesAsync(cancellationToken);
                    throw new HttpException()
                    {
                        StatusCode = 500,
                        Error = "Game is broken."
                    };
                }

                var random = new Random();

                var playerScenes = await _gameContext.SceneSegments.GetAsync(
                    x => x.GameId == request.GameId && (x.SceneId == currentPlayerScene.NextSceneId || x.NextSceneId == currentPlayerScene.SceneId), cancellationToken);
                if (currentPlayerScene.NextSceneId != null && !playerScenes.Any(x => x.SceneId == currentPlayerScene.NextSceneId))
                {
                    // NextLevel
                    var segment = await _mediator.Send(new GenerateNewSegmentCommand()
                    {
                        GameId = request.GameId,
                        SceneId = currentPlayerScene.NextSceneId.Value,
                        Seed = random.Next()
                    });
                    if (segment != null)
                    {
                        _gameContext.SceneSegments.InsertOne(segment);
                        playerScenes = playerScenes.Append(segment);
                    }
                }

                if (!playerScenes.Any(x => x.NextSceneId == currentPlayerScene.SceneId))
                {
                    // PreviousLevel
                    var segment = await _mediator.Send(new GenerateNewSegmentCommand()
                    {
                        GameId = request.GameId,
                        SceneId = currentPlayerScene.NextSceneId.Value,
                        NextScene = true,
                        Seed = random.Next()
                    });
                    if (segment != null)
                    {
                        _gameContext.SceneSegments.InsertOne(segment);
                        playerScenes = playerScenes.Append(segment);
                    }
                }

                playerScenes = playerScenes.Append(currentPlayerScene).ToList();
                var session = Guid.NewGuid().ToString();
                _gameContext.GameMeta.Update(
                    x => x.Id == request.GameId,
                    new UpdateDefinitionBuilder<GameMeta>().Set(x => x.Session, session));
                await _gameContext.ApplyChangesAsync(cancellationToken);
                return new FullGameStateDto()
                {
                    Player = new PlayerDto()
                    {
                        Scene = gameState.PlayerScene,
                        Actor = new ActorDto()
                        {
                            Id = gameState.PlayerActor.Id,
                            X = gameState.PlayerActor.X,
                            Y = gameState.PlayerActor.Y,
                            Name = gameState.PlayerActor.Name,
                            NativeId = gameState.PlayerActor.NativeId,
                            Durability = gameState.PlayerActor.Durability,
                            Energy = gameState.PlayerActor.Energy,
                            RemainedTurnTime = gameState.PlayerActor.RemainedTurnTime
                        }
                    },
                    MetaInformation = new MetaInformationDto()
                    {
                        GameId = request.GameId,
                        Session = session,
                        Incrementor = gameState.Incrementor,
                        Height = gameState.Height,
                        Width = gameState.Width,
                        Turn = gameState.Turn,
                        GameState = gameState.GameState
                    },
                    SceneSegments = playerScenes.Select(x => new SceneSegmentDto()
                    {
                        Seed = x.Seed,
                        RoomType = x.RoomType,
                        Difficulty = x.Difficulty,
                        LastSaveTurn = x.LastSaveTurn,
                        Actors = x.Actors.Select(actor => new ActorDto()
                        {
                            Id = actor.Id,
                            X = actor.X,
                            Y = actor.Y,
                            Name = actor.Name,
                            NativeId = actor.NativeId,
                            Durability = actor.Durability,
                            Energy = actor.Energy,
                            RemainedTurnTime = actor.RemainedTurnTime
                        }),
                        Tiles = x.Tiles.Select(tile => new TileDto()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            NativeId = tile.NativeId
                        }),
                        Id = x.SceneId,
                        NextId = x.NextSceneId
                    }),
                    UnsettledActors = new UnsettledActorDto[0]
                };
            }
        }
    }
}