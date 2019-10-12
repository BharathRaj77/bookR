using System;
using System.Linq.Expressions;
using UCB.Template.Domain;

namespace UCB.Template.WebApi.TodoItems.Models
{
    public class TodoItem
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public bool IsCompleted { get; set; }

        /// <summary>
        /// Converts the simplified sort expression into a <see cref="Sort{T}" />.
        /// </summary>
        /// <remarks>
        /// Using this strategy, you can easily convert a sort expression into the correct path of the queried entity or DTO.
        /// </remarks>
        public static Sort<Domain.Models.TodoItem> GetSortExpression(string sort)
        {
            if (string.IsNullOrWhiteSpace(sort))
            {
                return new Sort<Domain.Models.TodoItem>(x => x.Id);
            }

            var ascending = sort[0] != '-';

            // Remove the prefix
            if (sort[0] == '-' || sort[0] == '+')
            {
                sort = sort.Substring(1).Trim();
            }

            Expression<Func<Domain.Models.TodoItem, object>> sortExpression = x => x.Id;
            switch (sort)
            {
                case string s when string.Equals(s, nameof(Title), StringComparison.OrdinalIgnoreCase):
                    sortExpression = x => x.Title;
                    break;
                case string s when string.Equals(s, nameof(Description), StringComparison.OrdinalIgnoreCase):
                    sortExpression = x => x.Description;
                    break;
                case string s when string.Equals(s, nameof(IsCompleted), StringComparison.OrdinalIgnoreCase):
                    sortExpression = x => x.IsCompleted;
                    break;
            }

            return new Sort<Domain.Models.TodoItem>(sortExpression, ascending);
        }
    }
}