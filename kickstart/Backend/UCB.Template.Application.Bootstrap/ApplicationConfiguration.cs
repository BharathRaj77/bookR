using System;
using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace UCB.Template.Application.Bootstrap
{
    [ExcludeFromCodeCoverage]
    public class ApplicationConfiguration
    {
        public string ConnectionString { get; set; }
        public Action<SqlServerDbContextOptionsBuilder> SqlServerActions { get; set; } = actions => { };
    }
}