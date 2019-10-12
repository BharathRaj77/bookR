using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UCB.Template.Domain.Models;

namespace UCB.Template.Data.Configuration
{
    [ExcludeFromCodeCoverage]
    public class TodoItemEntityTypeConfiguration : IEntityTypeConfiguration<TodoItem>
    {
        public void Configure(EntityTypeBuilder<TodoItem> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.Title)
                .IsRequired()
                .HasMaxLength(100)
                .IsUnicode();

            builder.Property(x => x.Description)
                .IsUnicode();

            builder.Property(x => x.IsCompleted)
                .IsRequired();
        }
    }
}