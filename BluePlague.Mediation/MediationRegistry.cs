using System.Reflection;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace BluePlague.Mediation
{
  public static class MediationRegistry
    {
        public static Assembly GetAssembly()
        {
            return Assembly.GetExecutingAssembly();
        }

        public static IServiceCollection RegisterMediationLayer(this IServiceCollection services)
        {
            services.AddMediatR(Assembly.GetExecutingAssembly());
            return services;
        }
    }
}