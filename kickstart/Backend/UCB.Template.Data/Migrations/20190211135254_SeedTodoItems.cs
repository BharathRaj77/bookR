using UCB.Sherpa.Data.EntityFrameworkCore.Migrations;

namespace UCB.Template.Data.Migrations
{
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public partial class SeedTodoItems : SqlScriptDbMigration
    {
        public SeedTodoItems() : base("20190211135254_SeedTodoItems.sql", typeof(SeedTodoItems).Assembly)
        {
        }
    }
}
