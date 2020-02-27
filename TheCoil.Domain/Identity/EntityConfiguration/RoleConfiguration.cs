using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Identity.Entities;

namespace TheCoil.Domain.Identity.EntityConfiguration
{
    public class RoleConfiguration : IEntityConfiguration<Role>
    {
        public async Task ConfigureAsync(IMongoCollection<Role> collection)
        {
            await collection.Indexes.CreateManyAsync(new[]
            {
                new CreateIndexModel<Role>(Builders<Role>.IndexKeys.Ascending(x => x.NormalizedName)),
            });
        }
    }
}
