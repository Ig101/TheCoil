using System.Threading.Tasks;
using BluePlague.Domain.Identity.Entities;
using MongoDB.Driver;

namespace BluePlague.Domain.Identity.EntityConfigurations
{
    public class UserConfiguration : IEntityConfiguration<User>
    {
        public async Task ConfigureAsync(MongoDB.Driver.IMongoCollection<User> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedUserName)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedEmail)),
            });
        }
    }
}