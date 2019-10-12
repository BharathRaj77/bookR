using System;
using System.Threading.Tasks;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;

namespace UCB.Template.Domain.Services
{
    public interface ITodoItemService
    {
        Task<TodoItem> GetById(Guid id);
        Task<bool> Create(TodoItem item);
        Task<bool> Update(TodoItem item);
        Task<bool> Delete(Guid id);
        Task<Page<TodoItem>> Find(TodoItemFilter filter, Sort<TodoItem> sortOrder, int page, int pageSize);
    }
}