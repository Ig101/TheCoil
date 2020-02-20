using System.Threading.Tasks;
using BluePlague.Domain.Identity.Entities;
using MongoDB.Driver;

namespace BluePlague.Domain.Identity.EntityConfigurations
{
    public class RoleConfiguration : IEntityConfiguration<Role>
    {
        public async Task ConfigureAsync(MongoDB.Driver.IMongoCollection<Role> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<Role>(Builders<Role>.IndexKeys.Ascending(x => x.NormalizedName)),
            });
        }
    }
}