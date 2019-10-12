using System;
using System.Threading.Tasks;
using UCB.Sherpa.Data.Abstractions.Interfaces;
using UCB.Template.Domain;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;
using UCB.Template.Domain.Repositories;
using UCB.Template.Domain.Services;

namespace UCB.Template.Application.Services
{
    public class TodoItemService : ITodoItemService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ITodoItemRepository _repository;

        public TodoItemService(IUnitOfWork unitOfWork, ITodoItemRepository repository)
        {
            _unitOfWork = unitOfWork;
            _repository = repository;
        }

        public Task<Page<TodoItem>> Find(TodoItemFilter filter, Sort<TodoItem> sortOrder, int page, int pageSize)
        {
            return _repository.Find(filter, sortOrder, page, pageSize);
        }

        public Task<TodoItem> GetById(Guid id)
        {
            return _repository.GetById(id);
        }

        public async Task<bool> Create(TodoItem item)
        {
            await _repository.Create(item).ConfigureAwait(false);
            return await _unitOfWork.Save().ConfigureAwait(false);
        }

        public Task<bool> Update(TodoItem item)
        {
            _repository.Update(item);
            return _unitOfWork.Save();
        }

        public async Task<bool> Delete(Guid id)
        {
            await _repository.Delete(id).ConfigureAwait(false);
            return await _unitOfWork.Save().ConfigureAwait(false);
        }
    }
}