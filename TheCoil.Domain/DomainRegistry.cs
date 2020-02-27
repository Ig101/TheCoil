using AspNetCore.Identity.Mongo;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using TheCoil.Domain.Email;
using TheCoil.Domain.Game;
using TheCoil.Domain.Identity;
using TheCoil.Domain.Identity.Entities;

namespace TheCoil.Domain
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
                    identityOptions.Password.RequireNonAlphanumeric = false;
                    identityOptions.Password.RequireDigit = true;
                    identityOptions.User.RequireUniqueEmail = true;
                    identityOptions.SignIn.RequireConfirmedEmail = true;
                }, mongoIdentityOptions =>
                {
                    mongoIdentityOptions.ConnectionString = identityUrl;
                })
                .AddUserManager<IdentityUserManager>()
                .AddRoleManager<IdentityRoleManager>()
                .AddDefaultTokenProviders();
            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "Authorization";
                options.Cookie.HttpOnly = true;
                options.ReturnUrlParameter = CookieAuthenticationDefaults.ReturnUrlParameter;
                options.SlidingExpiration = true;
                options.LoginPath = "/api/Account/Login";
                options.AccessDeniedPath = "/api/Account/AccessDenied";
            });
            services.AddSingleton<MongoConnection>();
            services.AddTransient<GameContext>();
            services.AddTransient<EmailSender>();
            return services;
        }
    }
}