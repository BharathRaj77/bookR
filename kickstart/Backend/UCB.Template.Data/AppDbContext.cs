using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace UCB.Template.Data
{
    [ExcludeFromCodeCoverage]
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Load all EntityTypeConfiguration classes in the current assembly
            this.ApplyEntityTypeConfigurations(modelBuilder);
        }
    }
}