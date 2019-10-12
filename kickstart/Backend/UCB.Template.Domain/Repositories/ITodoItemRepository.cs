using System;
using System.Threading.Tasks;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;

namespace UCB.Template.Domain.Repositories
{
    public interface ITodoItemRepository
    {
        Task<TodoItem> GetById(Guid id);
        Task Create(TodoItem item);
        TodoItem Update(TodoItem item);
        Task Delete(Guid id);
        Task<Page<TodoItem>> Find(TodoItemFilter filter, Sort<TodoItem> sortOrder, int page, int pageSize);
    }
}