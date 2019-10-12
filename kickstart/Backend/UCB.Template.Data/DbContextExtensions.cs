using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace UCB.Template.Data
{
    [ExcludeFromCodeCoverage]
    public static class DbContextExtensions
    {
        [ExcludeFromCodeCoverage]
        // This method will move to a next version of the UCB.Data.EFCore NuGet package
        public static void ApplyEntityTypeConfigurations(this DbContext dbContext, ModelBuilder modelBuilder)
        {
            var entityTypeConfigurationType = typeof(IEntityTypeConfiguration<>);
            var getTypedEntityBuilder = typeof(ModelBuilder)
                .GetMethods(BindingFlags.Instance | BindingFlags.Public)
                .First(x => x.Name == nameof(ModelBuilder.Entity) && x.IsGenericMethod);

            var entityConfigurations = dbContext.GetType().Assembly.GetTypes().Where(x =>
                !x.IsAbstract &&
                x.IsClass &&
                x.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == entityTypeConfigurationType)
            ).ToArray();

            foreach (var entityConfiguration in entityConfigurations)
            {
                // Find TEntity
                var concreteConfigurationType = entityConfiguration.GetTypeInfo().ImplementedInterfaces
                    .Single(x => x.IsGenericType && x.GetGenericTypeDefinition() == entityTypeConfigurationType);
                var entityType = concreteConfigurationType.GetGenericArguments()[0];

                // Find IEntityTypeConfiguration<TEntity>.Configure()
                var methodInfo = concreteConfigurationType.GetMethod(nameof(IEntityTypeConfiguration<object>.Configure));

                // Create an instance of IEntityConfiguration<TEntity>
                var configurationInstance = Activator.CreateInstance(entityConfiguration);

                // Create an instance of EntityTypeBuilder<TEntity>
                var entityTypeBuilder = getTypedEntityBuilder.MakeGenericMethod(entityType).Invoke(modelBuilder, null);

                // And invoke Configure(EntityTypeBuilder<TEntity> builder)
                methodInfo.Invoke(configurationInstance, new[] { entityTypeBuilder });
            }
        }
    }
}