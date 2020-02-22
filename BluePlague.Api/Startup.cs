using System;
using BluePlague.Api.Filters;
using BluePlague.Domain;
using BluePlague.Domain.Email;
using BluePlague.Domain.Game;
using BluePlague.Domain.Identity;
using BluePlague.Mediation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;

namespace BluePlague.Api
{
  public class Startup
    {
        public Startup(IWebHostEnvironment environment)
        {
            Configuration = new ConfigurationBuilder()
                .SetBasePath(environment.ContentRootPath)
                .AddJsonFile("appsettings.json", true, true)
                .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", true, true)
                .AddEnvironmentVariables()
                .Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddControllers(options =>
                {
                    options.Filters.Add(typeof(ValidationFilter));
                    options.Filters.Add(typeof(ExceptionFilter));
                })
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver =
                        new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                })
                .AddFluentValidation(options =>
                {
                    options.RegisterValidatorsFromAssembly(MediationRegistry.GetAssembly());
                });
            services.Configure<MongoConnectionSettings>(
                Configuration.GetSection("MongoConnection"));
            services.Configure<MongoContextSettings<GameContext>>(
                Configuration.GetSection("MongoConnection:Game"));
            services.Configure<EmailSenderSettings>(
                Configuration.GetSection("SmtpServer"));
            services.RegisterDomainLayer($"{Configuration["MongoConnection:ServerName"]}/{Configuration["MongoConnection:Identity:DatabaseName"]}");
            services.RegisterMediationLayer();
        }

        private bool IsFrontendRoute(HttpContext context)
        {
            var path = context.Request.Path;
            return path.HasValue &&
                !path.Value.StartsWith("/api", StringComparison.OrdinalIgnoreCase);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.ApplicationServices.GetRequiredService<MongoConnection>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                var action = new Action<IApplicationBuilder>(builder => builder.RunProxy(new ProxyOptions
                {
                    Scheme = "http",
                    Host = "localhost",
                    Port = "4200"
                }));
                app.MapWhen(IsFrontendRoute, action);
                app.UseStaticFiles();
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
