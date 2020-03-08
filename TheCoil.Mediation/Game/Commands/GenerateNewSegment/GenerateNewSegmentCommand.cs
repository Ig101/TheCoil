using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Game;
using TheCoil.Domain.Game.Entities;
using TheCoil.Domain.Game.EntityModels;
using TheCoil.Domain.Registry;
using TheCoil.Domain.Registry.Entities;
using TheCoil.Infrastructure.Models.ErrorHandling;
using TheCoil.Infrastructure.Models.Game;

namespace TheCoil.Mediation.Game.Commands.GenerateNewSegment
{
    internal class GenerateNewSegmentCommand : IRequest<SceneSegment>
    {
        public Guid GameId { get; set; }

        public int SceneId { get; set; }

        public bool NextScene { get; set; } = false;

        public int Seed { get; set; } = 0;

        internal class Handler : IRequestHandler<GenerateNewSegmentCommand, SceneSegment>
        {
            private readonly GameContext _gameContext;
            private readonly RegistryContext _registryContext;

            public Handler(
                GameContext gameContext,
                RegistryContext registryContext)
            {
                _registryContext = registryContext;
                _gameContext = gameContext;
            }

            public async Task<SceneSegment> Handle(GenerateNewSegmentCommand request, CancellationToken cancellationToken)
            {
                SceneSegmentNative sceneSegmentNative;
                if (request.NextScene)
                {
                    sceneSegmentNative = await _registryContext.SceneSegments.GetOneAsync(x => x.NextId == request.SceneId);
                }
                else
                {
                    sceneSegmentNative = await _registryContext.SceneSegments.GetOneAsync(x => x.Id == request.SceneId);
                }

                if (sceneSegmentNative == null)
                {
                    return null;
                }

                return new SceneSegment()
                {
                    Id = Guid.NewGuid(),
                    GameId = request.GameId,
                    Seed = request.Seed,
                    RoomType = sceneSegmentNative.RoomType,
                    Difficulty = sceneSegmentNative.Difficulty,
                    LastSaveTurn = -1,
                    Actors = new Actor[0],
                    Tiles = new Tile[0],
                    SceneId = sceneSegmentNative.Id,
                    NextSceneId = sceneSegmentNative.NextId
                };
            }
        }
    }
}