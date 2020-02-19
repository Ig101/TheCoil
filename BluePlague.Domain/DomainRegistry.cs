using AspNetCore.Identity.Mongo;
using BluePlague.Domain.Game;
using BluePlague.Domain.Identity;
using BluePlague.Domain.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BluePlague.Domain
{
    public static class DomainRegistry
    {
        public static IServiceCollection RegisterDomainLayer(this IServiceCollection services, string identityUrl)
        {
            services.AddIdentityMongoDbProvider<User, Role>(
                identityOptions =>
                {
                    identityOptions.Password.RequiredLength = 8;
                    identityOptions.Password.RequireLowercase = true;
                    identityOptions.Password.RequireUppercase = true;
                    identityOptions.Password.RequireNonAlphanumeric = true;
                    identityOptions.Password.RequireDigit = true;
                    identityOptions.User.RequireUniqueEmail = true;
                }, mongoIdentityOptions =>
                {
                    mongoIdentityOptions.ConnectionString = identityUrl;
                })
                .AddUserManager<IdentityUserManager>()
                .AddRoleManager<IdentityRoleManager>()
                .AddDefaultTokenProviders();
            services.AddSingleton<MongoConnection>();
            services.AddTransient<GameContext>();
            return services;
        }
    }
}