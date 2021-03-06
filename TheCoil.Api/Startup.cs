using System;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using TheCoil.Api.Filters;
using TheCoil.Domain;
using TheCoil.Domain.Email;
using TheCoil.Domain.Game;
using TheCoil.Domain.Registry;
using TheCoil.Infrastructure;
using TheCoil.Mediation;

namespace TheCoil.Api
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
            services.Configure<ServerSettings>(
                Configuration.GetSection("Server"));
            services.Configure<MongoConnectionSettings>(
                Configuration.GetSection("MongoConnection"));
            services.Configure<MongoContextSettings<GameContext>>(
                Configuration.GetSection("MongoConnection:Game"));
            services.Configure<MongoContextSettings<RegistryContext>>(
                Configuration.GetSection("MongoConnection:Registry"));
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
            }

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
