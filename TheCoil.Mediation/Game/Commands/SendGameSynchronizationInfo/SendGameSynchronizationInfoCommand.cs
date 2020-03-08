using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using MongoDB.Driver;
using TheCoil.Domain.Game;
using TheCoil.Domain.Game.Entities;
using TheCoil.Domain.Game.EntityModels;
using TheCoil.Infrastructure.Models.ErrorHandling;
using TheCoil.Infrastructure.Models.Game;
using TheCoil.Mediation.Game.Commands.GenerateNewSegment;

namespace TheCoil.Mediation.Game.Commands.SendGameSynchronizationInfo
{
    public class SendGameSynchronizationInfoCommand : IRequest<GameStateDto>
    {
        public Guid GameId { get; set; }

        public string Session { get; set; }

        public MetaInformationForUpdateDto MetaInformation { get; set; }

        public PlayerDto Player { get; set; }

        public IEnumerable<SceneSegmentForUpdateDto> SceneSegments { get; set; }

        public string UserName { get; set; }

        internal class Handler : IRequestHandler<SendGameSynchronizationInfoCommand, GameStateDto>
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

            public async Task<GameStateDto> Handle(SendGameSynchronizationInfoCommand request, CancellationToken cancellationToken)
            {
                var check = await _gameContext.GameMeta.GetOneAsync(
                    x => x.Id == request.GameId && x.Session == request.Session && x.UserName == request.UserName,
                    x => (Guid?)x.Id,
                    cancellationToken);
                if (check == null)
                {
                    throw new HttpException()
                    {
                        StatusCode = 404,
                        Error = "Wrong session or game is not found."
                    };
                }

                var playerActor = request.Player.Actor;
                var update = new UpdateDefinitionBuilder<GameMeta>()
                    .Set(x => x.Incrementor, request.MetaInformation.Incrementor)
                    .Set(x => x.LastDate, DateTime.Now)
                    .Set(x => x.PlayerScene, request.Player.Scene)
                    .Set(x => x.Turn, request.MetaInformation.Turn)
                    .Set(x => x.PlayerActor, new Actor()
                    {
                        Id = playerActor.Id,
                        X = playerActor.X,
                        Y = playerActor.Y,
                        Name = playerActor.Name,
                        NativeId = playerActor.NativeId,
                        Durability = playerActor.Durability,
                        Energy = playerActor.Energy,
                        RemainedTurnTime = playerActor.RemainedTurnTime
                    });
                _gameContext.GameMeta.Update(x => x.Id == request.GameId, update);
                foreach (var segment in request.SceneSegments)
                {
                    var sceneUpdate = new UpdateDefinitionBuilder<SceneSegment>()
                        .Set(x => x.LastSaveTurn, segment.LastSaveTurn)
                        .Set(x => x.NextSceneId, segment.NextId)
                        .Set(x => x.Difficulty, segment.Difficulty)
                        .Set(x => x.Actors, segment.Actors.Select(actor => new Actor()
                        {
                            Id = actor.Id,
                            X = actor.X,
                            Y = actor.Y,
                            Name = actor.Name,
                            NativeId = actor.NativeId,
                            Durability = actor.Durability,
                            Energy = actor.Energy,
                            RemainedTurnTime = actor.RemainedTurnTime
                        }))
                        .Set(x => x.Tiles, segment.Tiles.Select(tile => new Tile()
                        {
                            X = tile.X,
                            Y = tile.Y,
                            NativeId = tile.NativeId
                        }));
                    _gameContext.SceneSegments.Update(x => x.GameId == request.GameId && x.SceneId == segment.Id, sceneUpdate);
                }

                var random = new Random();
                var currentPlayerScene = request.SceneSegments.FirstOrDefault(x => x.Id == request.Player.Scene);
                var newScenes = new List<SceneSegment>();
                if (currentPlayerScene.NextId != null && !request.SceneSegments.Any(x => x.Id == currentPlayerScene.NextId))
                {
                    // NextLevel
                    var segment = await _gameContext.SceneSegments.GetOneAsync(
                        x => request.GameId == x.GameId && x.SceneId == currentPlayerScene.NextId, cancellationToken);
                    if (segment == null)
                    {
                        segment = await _mediator.Send(new GenerateNewSegmentCommand()
                        {
                            GameId = request.GameId,
                            SceneId = currentPlayerScene.NextId.Value,
                            Seed = random.Next()
                        });
                    }

                    if (segment != null)
                    {
                        _gameContext.SceneSegments.InsertOne(segment);
                        newScenes.Add(segment);
                    }
                }

                if (!request.SceneSegments.Any(x => x.NextId == currentPlayerScene.Id))
                {
                    // PreviousLevel
                    var segment = await _gameContext.SceneSegments.GetOneAsync(
                        x => request.GameId == x.GameId && x.NextSceneId == currentPlayerScene.Id, cancellationToken);
                    if (segment == null)
                    {
                        segment = await _mediator.Send(new GenerateNewSegmentCommand()
                        {
                            GameId = request.GameId,
                            SceneId = currentPlayerScene.NextId.Value,
                            NextScene = true,
                            Seed = random.Next()
                        });
                    }

                    if (segment != null)
                    {
                        _gameContext.SceneSegments.InsertOne(segment);
                        newScenes.Add(segment);
                    }
                }

                await _gameContext.ApplyChangesAsync(cancellationToken);
                return new GameStateDto()
                {
                    SceneSegments = newScenes.Select(x => new SceneSegmentDto()
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