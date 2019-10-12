using System.Diagnostics.CodeAnalysis;

namespace UCB.Template.WebApi.TodoItems.Models
{
    [ExcludeFromCodeCoverage]
    public class TodoItemToUpdate : TodoItemToCreate
    {
        public bool IsCompleted { get; set; }
    }
}