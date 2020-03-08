using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Game.Entities;

namespace TheCoil.Domain.Game.EntityConfiguration
{
    public class GameMetaConfiguration : IEntityConfiguration<GameMeta>
    {
        public async Task ConfigureAsync(IMongoCollection<GameMeta> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<GameMeta>(Builders<GameMeta>.IndexKeys.Ascending(x => x.UserName))
            });
        }
    }
}