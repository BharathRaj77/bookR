using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace UCB.Template.WebApi.TodoItems.Models
{
    [ExcludeFromCodeCoverage]
    public class TodoItemToCreate
    {
        [Required, StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }
    }
}
