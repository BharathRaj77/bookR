using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UCB.Sherpa.AspNetCore.Mvc.Handlers;
using UCB.Template.Application.Bootstrap;
using SwaggerInfo = Swashbuckle.AspNetCore.Swagger.Info;

namespace UCB.Template.WebApi
{
    [ExcludeFromCodeCoverage]
    public class Startup
    {
        private readonly ILogger<Startup> _logger;

        public Startup(IConfiguration configuration, ILoggerFactory loggerFactory)
        {
            Configuration = configuration;

            // Create the Startup logger after adding the AI logger
            _logger = loggerFactory.CreateLogger<Startup>();
        }

        public IConfiguration Configuration { get; }

        public void ConfigureDevelopmentServices(IServiceCollection services)
        {
            ConfigureBaseServices(services);
        }

        public void ConfigureStagingServices(IServiceCollection services)
        {
            ConfigureBaseServices(services);
        }

        public void ConfigureProductionServices(IServiceCollection services)
        {
            ConfigureBaseServices(services);

            // Optional. Configure HSTS if you want to use this OWASP recommendation. https://www.owasp.org/index.php/HTTP_Strict_Transport_Security_Cheat_Sheet
            services.AddHsts(x =>
            {
                x.Preload = false; // Only necessary for publicly accessable apps/api's. You need to submit the URI for this to work to https://hstspreload.org/
                x.IncludeSubDomains = false; // To either include or exclude all subdomains of the root URI
            });
        }

        private void ConfigureBaseServices(IServiceCollection services)
        {
            services
                .AddCors()
                .AddMvc(options =>
                {
                    options.Filters.Add(new ResponseCacheAttribute
                    {
                        NoStore = true,
                        Location = ResponseCacheLocation.None
                    });
                    options.OutputFormatters.RemoveType<StringOutputFormatter>();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2); // Sets the defaults for MvcOptions to match those for ASP.NET Core 2.2

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => Configuration.GetSection("Authentication").Bind(options));

            ConfigureSwagger(services);

            // Bootstrap the application
            services.ConfigureApplication(x =>
            {
                x.ConnectionString = Configuration["DatabaseConnectionString"];
                x.SqlServerActions = o => o.EnableRetryOnFailure(5);
            });

            // Register AutoMapper profiles
            services.AddAutoMapper();
        }

        public void ConfigureDevelopment(IApplicationBuilder app)
        {
            app.UseDatabaseErrorPage();
            app.UseDeveloperExceptionPage();

            DefaultHttpPipeline(app);
        }

        public void ConfigureStaging(IApplicationBuilder app)
        {
            app.UseHttpsRedirection();
            app.UseUcbExceptionHandler();

            DefaultHttpPipeline(app);
        }

        public void ConfigureProduction(IApplicationBuilder app)
        {
            app.UseHttpsRedirection();
            app.UseUcbExceptionHandler();

            // HSTS tells your web browser to cache the fact that your web app/api should
            // only be reachable over HTTPS. A browser then performs a local redirect to HTTPS.
            app.UseHsts();

            DefaultHttpPipeline(app);
        }

        private void DefaultHttpPipeline(IApplicationBuilder app)
        {
            var origins = GetCorsOrigins();
            app.UseCors(builder => builder
                .WithOrigins(origins)
                .SetPreflightMaxAge(TimeSpan.FromHours(24))
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials());

            // Before UseAuthentication to allow anonymous users to access the API docs.
            AddSwagger(app);

            app.UseAuthentication();
            app.UseMvc();
        }

        private void ConfigureSwagger(IServiceCollection services)
        {
            var apiVersions = GetApiVersions();
            if (apiVersions.Length == 0)
            {
                _logger.LogError("Missing \"ApiVersions\" configuration entry for Swagger in appsettings.json!");
                return;
            }

            services.AddSwaggerGen(x =>
            {
                var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = System.IO.Path.Combine(AppContext.BaseDirectory, xmlFile);
                if (!System.IO.File.Exists(xmlPath))
                {
                    _logger.LogWarning("XML documentation file not found! Expected location: {0}", xmlPath);
                }
                else
                {
                    x.IncludeXmlComments(xmlPath);
                }

                // What if the same version occurs multiple times?
                foreach (var apiVersion in apiVersions)
                {
                    x.SwaggerDoc(apiVersion.Version, apiVersion);
                }
            });
        }
        private void AddSwagger(IApplicationBuilder app)
        {
            var apiVersions = GetApiVersions();
            if (apiVersions.Length == 0)
            {
                // we already logged an error, we simple exit without setting up swagger
                return;
            }

            app
                .UseSwagger()
                .UseSwaggerUI(x =>
                {
                    foreach (var apiVersion in apiVersions.OrderBy(v => v.Version))
                    {
                        x.SwaggerEndpoint($"/swagger/{apiVersion.Version}/swagger.json", $"{apiVersion.Title} {apiVersion.Version}");
                    }
                });
        }

        private SwaggerInfo[] GetApiVersions() => GetConfigurationValues<SwaggerInfo>("ApiVersions");
        private string[] GetCorsOrigins() => Configuration
            .GetValue<string>("AllowedOrigins")
            .Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries);
        private T[] GetConfigurationValues<T>(string key) => Configuration.GetSection(key).Get<T[]>() ?? new T[0];
    }
}
