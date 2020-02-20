using BluePlague.Domain.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BluePlague.Domain.Identity
{
    public static class IdentityConfiguration
    {
        public static void ConfigureIdentity(this IMongoClient client, IdentityContextSettings settings)
        {
            var db = client.GetDatabase(settings.DatabaseName);
            db.GetCollection<User>("Users").Indexes.CreateMany(new[]
            {
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedUserName)),
                new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(x => x.NormalizedEmail)),
            });
            db.GetCollection<Role>("Roles").Indexes.CreateMany(new[]
            {
                new CreateIndexModel<Role>(Builders<Role>.IndexKeys.Ascending(x => x.NormalizedName)),
            });
        }
    }
}