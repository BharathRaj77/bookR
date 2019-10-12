using System;
using System.Diagnostics.CodeAnalysis;
using System.Net;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Azure.KeyVault;
using Microsoft.Azure.Services.AppAuthentication;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.AzureKeyVault;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UCB.Template.Data;

namespace UCB.Template.WebApi
{
    [ExcludeFromCodeCoverage]
    public static class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                BuildWebHost(args).Run();
            }
            catch (Exception exception) when (LogException(exception, "Application failed to start"))
            {
                // this will not be executed
            }
        }

        public static IWebHost BuildWebHost(string[] args)
        {
            var webHostBuilder = CreateWebHostBuilder(args);
            ConfigureKestrel(webHostBuilder);

            var webHost = webHostBuilder.Build();
            UpdateDatabase(webHost.Services);

            return webHost;
        }

        public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseApplicationInsights()
                .ConfigureLogging(x => x.AddApplicationInsights())
                .ConfigureAppConfiguration((ctx, builder) =>
                {
                    var keyVaultEndpoint = builder.Build()["KeyVaultEndPoint"];

                    //if flag set to false, make sure you provide a connection string in appsetting.json for DatabaseConnectionString
                    var useAzureKeyVault = Convert.ToBoolean(builder.Build()["UseAzureKeyVaultFlag"]);

                    if (!string.IsNullOrEmpty(keyVaultEndpoint)
                        && Uri.IsWellFormedUriString(keyVaultEndpoint, UriKind.Absolute)
                        && useAzureKeyVault)
                    {
                        var azureServiceTokenProvider = new AzureServiceTokenProvider();
                        var keyVaultClient = new KeyVaultClient(
                            new KeyVaultClient.AuthenticationCallback(
                                azureServiceTokenProvider.KeyVaultTokenCallback));
                        builder.AddAzureKeyVault(
                            keyVaultEndpoint, keyVaultClient, new DefaultKeyVaultSecretManager());
                    }
                })
                .UseStartup<Startup>();

        private static void ConfigureKestrel(IWebHostBuilder webHostBuilder)
        {
            webHostBuilder.ConfigureKestrel((ctx, options) =>
            {
                options.AddServerHeader = false;

                var config = ctx.Configuration;
                var useHttps = config.GetValue<bool>("KestrelOptions:UseSsl");
                if (!useHttps)
                    return;

                var certificate = config.GetValue<string>("KestrelOptions:Certificate");
                var certificatePassword = config.GetValue<string>("KestrelOptions:CertificatePassword");
                options.Listen(IPAddress.Any, 443, listenOptions =>
                {
                    listenOptions.UseHttps(certificate, certificatePassword);
                });
            });
        }

        private static void UpdateDatabase(IServiceProvider serviceProvider)
        {
            try
            {
                using (var scope = serviceProvider.CreateScope())
                {
                    var dbc = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    dbc.Database.Migrate();
                }
            }
            catch (Exception exception) when (LogException(exception, "Failed to update database"))
            {
                // this will not be executed
            }
        }

        private static bool LogException(Exception exception, string message)
        {
            var telemetryMessage = new ExceptionTelemetry(exception)
            {
                Message = message
            };

            var telemetryClient = new Microsoft.ApplicationInsights.TelemetryClient();
            telemetryClient.TrackException(telemetryMessage);

            return false;
        }
    }
}

