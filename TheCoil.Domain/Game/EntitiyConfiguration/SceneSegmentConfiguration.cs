using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Game.Entities;

namespace TheCoil.Domain.Game.EntityConfiguration
{
    public class SceneSegmentConfiguration : IEntityConfiguration<SceneSegment>
    {
        public async Task ConfigureAsync(IMongoCollection<SceneSegment> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<SceneSegment>(Builders<SceneSegment>.IndexKeys.Ascending(x => x.GameId)),
                new CreateIndexModel<SceneSegment>(Builders<SceneSegment>.IndexKeys.Ascending(x => x.SceneId)),
                new CreateIndexModel<SceneSegment>(Builders<SceneSegment>.IndexKeys.Ascending(x => x.NextSceneId)),
            });
        }
    }
}