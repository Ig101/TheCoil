using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using BluePlague.Domain;
using BluePlague.Domain.Game;

namespace BluePlague.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services
                .AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.ContractResolver =
                        new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
                    options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                });
            services.Configure<MongoConnectionSettings>(
                Configuration.GetSection("MongoConnection"));
            services.Configure<MongoContextSettings<GameContext>>(
                Configuration.GetSection("MongoConnection:Game"));
            services.RegisterDomainLayer();
        }

        bool IsFrontendRoute(HttpContext context) {
            var path = context.Request.Path;
            return path.HasValue &&
                !path.Value.StartsWith("/api", StringComparison.OrdinalIgnoreCase);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
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
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
