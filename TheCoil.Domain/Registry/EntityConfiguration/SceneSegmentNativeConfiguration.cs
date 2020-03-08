using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Registry.Entities;

namespace TheCoil.Domain.Registry.EntityConfiguration
{
    public class SceneSegmentNativeConfiguration : IEntityConfiguration<SceneSegmentNative>
    {
        public async Task ConfigureAsync(IMongoCollection<SceneSegmentNative> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<SceneSegmentNative>(Builders<SceneSegmentNative>.IndexKeys.Ascending(x => x.NextId))
            });
        }
    }
}