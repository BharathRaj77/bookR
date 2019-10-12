namespace UCB.Template.Domain.Filters
{
    public class TodoItemFilter
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public bool? IsCompleted { get; set; }
    }
}