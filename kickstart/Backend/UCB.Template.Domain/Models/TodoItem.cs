using UCB.Sherpa.Data.Abstractions.Entities;

namespace UCB.Template.Domain.Models
{
    public class TodoItem : TimeTrackedEntity
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }
    }
}