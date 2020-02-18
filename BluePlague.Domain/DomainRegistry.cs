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
                    identityOptions.Password.RequireLowercase = false;
                    identityOptions.Password.RequireUppercase = false;
                    identityOptions.Password.RequireNonAlphanumeric = false;
                    identityOptions.Password.RequireDigit = false;
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