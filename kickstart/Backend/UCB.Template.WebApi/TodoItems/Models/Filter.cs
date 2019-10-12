using Microsoft.AspNetCore.Mvc;

namespace UCB.Template.WebApi.TodoItems.Models
{
    public class Filter
    {
        [FromQuery]
        public string Title { get; set; }

        [FromQuery]
        public string Description { get; set; }

        [FromQuery]
        public bool? IsCompleted { get; set; }
    }
}