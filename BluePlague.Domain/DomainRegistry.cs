using BluePlague.Domain.Game;
using Microsoft.Extensions.DependencyInjection;

namespace BluePlague.Domain
{
    public static class DomainRegistry
    {
        public static IServiceCollection RegisterDomainLayer(this IServiceCollection services) {
            services.AddSingleton<MongoConnection>();
            services.AddTransient<GameContext>();
            return services;
        }
    }
}