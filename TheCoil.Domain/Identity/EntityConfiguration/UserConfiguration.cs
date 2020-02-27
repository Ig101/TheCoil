using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Identity.Entities;

namespace TheCoil.Domain.Identity.EntityConfiguration
{
    public class UserConfiguration : IEntityConfiguration<User>
    {
        public async Task ConfigureAsync(IMongoCollection<User> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedUserName)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedEmail)),
            });
        }
    }
}