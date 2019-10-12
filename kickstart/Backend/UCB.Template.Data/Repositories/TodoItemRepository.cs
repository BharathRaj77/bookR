using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using UCB.Sherpa.Data.Abstractions.Interfaces;
using UCB.Template.Domain;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;
using UCB.Template.Domain.Repositories;

namespace UCB.Template.Data.Repositories
{
    public class TodoItemRepository : ITodoItemRepository
    {
        private readonly IUnitOfWork _uow;

        public TodoItemRepository(IUnitOfWork uow)
        {
            _uow = uow;
        }

        public Task<TodoItem> GetById(Guid id)
        {
            return _uow.GetRepository<TodoItem>().FindById(id);
        }

        public Task Create(TodoItem item)
        {
            return _uow.GetRepository<TodoItem>().Create(item);
        }

        public TodoItem Update(TodoItem item)
        {
            return _uow.GetRepository<TodoItem>().Update(item);
        }

        public Task Delete(Guid id)
        {
            return _uow.GetRepository<TodoItem>().Delete(id);
        }

        public async Task<Page<TodoItem>> Find(TodoItemFilter filter, Sort<TodoItem> sortOrder, int page, int pageSize)
        {
            var query  = _uow.GetRepository<TodoItem>().FindAll(null, false);

            if (!string.IsNullOrEmpty(filter?.Title))
            {
                query = query.Where(x => x.Title.StartsWith(filter.Title));
            }

            if (!string.IsNullOrEmpty(filter?.Description))
            {
                query = query.Where(x => x.Description.Contains(filter.Description));
            }

            if (filter?.IsCompleted != null)
            {
                query = query.Where(x => x.IsCompleted == filter.IsCompleted);
            }

            if (sortOrder == null)
            {
                // Skip doesn't work on unordered queries, so provide a default sort.
                query = query.OrderBy(x => x.Id);
            }
            else
            {
                query = sortOrder.Ascending ? query.OrderBy(sortOrder.Expression) : query.OrderByDescending(sortOrder.Expression);
            }

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToArrayAsync()
                .ConfigureAwait(false);

            var totalItems = await query.CountAsync().ConfigureAwait(false);

            return new Page<TodoItem>(items, page, pageSize, totalItems);
        }
    }
}