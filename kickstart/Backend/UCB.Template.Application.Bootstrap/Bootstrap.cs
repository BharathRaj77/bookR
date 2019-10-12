using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using UCB.Template.Application.Services;
using UCB.Template.Data;
using UCB.Template.Data.Repositories;
using UCB.Template.Domain.Repositories;
using UCB.Template.Domain.Services;

namespace UCB.Template.Application.Bootstrap
{
    /// <summary>
    /// This class registers all components into the dependency injection container
    /// </summary>
    [ExcludeFromCodeCoverage]
    public static class Bootstrap
    {
        /// <summary>
        /// Configures all services provided and needed by this application
        /// </summary>
        /// <param name="services">The <see cref="IServiceCollection"/>.</param>
        /// <param name="setupAction">A delegate used to configure <see cref="ApplicationConfiguration"/>.</param>
        /// <returns></returns>
        public static IServiceCollection ConfigureApplication(this IServiceCollection services, Action<ApplicationConfiguration> setupAction)
        {
            if (services == null)
            {
                throw new ArgumentNullException(nameof(services));
            }

            if (setupAction == null)
            {
                throw new ArgumentNullException(nameof(setupAction));
            }

            var configuration = new ApplicationConfiguration();
            setupAction(configuration);

            ConfigureDbContext(services, configuration);

            services.AddLogging();
            services.AddRepositories();
            services.AddUnitOfWork<AppDbContext>();
            services.AddScoped<ITodoItemRepository, TodoItemRepository>();
            services.AddScoped<ITodoItemService, TodoItemService>();

            return services;
        }

        private static void ConfigureDbContext(IServiceCollection services, ApplicationConfiguration configuration)
        {
            services.AddDbContextPool<AppDbContext>(o =>
            {
                o.UseSqlServer(configuration.ConnectionString, configuration.SqlServerActions);
            });
            services.AddScoped<DbContext>(serviceProvider => serviceProvider.GetRequiredService<AppDbContext>());
        }
    }
}
