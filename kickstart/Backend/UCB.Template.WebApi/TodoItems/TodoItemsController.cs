using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Services;
using UCB.Template.WebApi.Paging;
using UCB.Template.WebApi.TodoItems.Models;
using UCB.Sherpa.AspNetCore.Mvc.WebAPI.Controllers;

namespace UCB.Template.WebApi.TodoItems
{
    /// <summary>
    /// API controller for the todoitems resource
    /// </summary>
    [Route("api/[controller]")]
    public class TodoItemsController : ApiBaseController
    {
        private readonly IMapper _mapper;
        private readonly ITodoItemService _service;
        
        /// <summary>
        /// Constructor.
        /// </summary>
        /// <param name="mapper"><see cref="IMapper"/> used to map domain entities to API models and vice-versa.</param>
        /// <param name="service"><see cref="ITodoItemService"/> to manage todoitems.</param>
        /// <param name="logger"><see cref="ILogger{TCategoryName}"/>.</param>
        public TodoItemsController(IMapper mapper, ITodoItemService service, ILogger<TodoItemsController> logger) : base(logger)
        {
            _mapper = mapper;
            _service = service;
        }

        /// <summary>
        /// Retrieves all todoitems.
        /// </summary>
        /// <param name="filter">Optional. Used to filter the todoitems on title, description or being completed.</param>
        /// <param name="sort">Optional. Used to sort the todoitems.</param>
        /// <param name="pageData">Optional. Used to request a specific page and page size.</param>
        /// <remarks>
        /// To sort, specify a valid field name (id, title, description or isCompleted) and
        /// prefix it with a plus (+) to sort ascending or minus (-) to sort descending.
        ///
        /// If you don't prefix the sort field, then ascending order is assumed.
        /// </remarks>
        [HttpGet]
        [ProducesResponseType(200)]
        public async Task<ActionResult<Page<TodoItem>>> GetTodoItems(Filter filter, string sort, PageData pageData)
        {
            var entityFilter = _mapper.Map<TodoItemFilter>(filter);
            var sortOrder = TodoItem.GetSortExpression(sort);

            var itemEntities = await _service.Find(entityFilter, sortOrder, pageData.Page, pageData.PageSize);
            var items = _mapper.Map<Page<TodoItem>>(itemEntities);

            return Ok(items);
        }

        /// <summary>
        /// Retrieves a single todoitem, identified by <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The identifier of a todoitem.</param>
        [HttpGet("{id:guid}", Name = nameof(GetTodoItem))]
        [ProducesResponseType(200)]
        [ProducesResponseType(404)]
        public async Task<ActionResult<TodoItem>> GetTodoItem(Guid id)
        {
            var item = await _service.GetById(id);
            if (item == null)
            {
                return NotFound();
            }

            return _mapper.Map<TodoItem>(item);
        }

        /// <summary>
        /// Creates a new todoitem.
        /// </summary>
        /// <param name="model">A <see cref="TodoItemToCreate"/>, containing information about the new todoitem.</param>
        [HttpPost]
        [ProducesResponseType(typeof(TodoItem), 201)]
        [ProducesResponseType(400)]
        [ProducesResponseType(422)]
        [ProducesResponseType(500)]
        public async Task<ActionResult<TodoItem>> CreateTodoItem([FromBody]TodoItemToCreate model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            var entity = _mapper.Map<Domain.Models.TodoItem>(model);
            if (!await _service.Create(entity))
            {
                throw new ApiException("Creation of todo item failed on save.");
            }

            return CreatedAtRoute(nameof(GetTodoItem), new { entity.Id }, _mapper.Map<TodoItem>(entity));
        }

        /// <summary>
        /// Fully updates (or replaces) a todoitem identified by <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The identifier of an existing todoitem.</param>
        /// <param name="model">A <see cref="TodoItemToUpdate"/> containing updated information.</param>
        [HttpPut("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(422)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> ReplaceTodoItem(Guid id, [FromBody]TodoItemToUpdate model)
        {
            if (model == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            var entity = await _service.GetById(id);
            if (entity == null)
            {
                return NotFound();
            }

            _mapper.Map(model, entity);
            if (!await _service.Update(entity))
            {
                throw new ApiException($"Update of todo item {id} failed on save.");
            }

            return NoContent();
        }

        /// <summary>
        /// Removes the todoitem identified by <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The identifier of the todoitem.</param>
        [HttpDelete("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(404)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> RemoveTodoItem(Guid id)
        {
            var entity = await _service.GetById(id);
            if (entity == null)
            {
                return NotFound();
            }

            if (!await _service.Delete(entity.Id))
            {
                throw new ApiException($"Removal of todo item {id} failed on save.");
            }

            return NoContent();
        }

        /// <summary>
        /// Partially updates a todoitem identified by <paramref name="id"/>.
        /// </summary>
        /// <param name="id">The identifier of the todoitem.</param>
        /// <param name="patchDoc">A <see cref="JsonPatchDocument{TModel}"/> for <see cref="TodoItemToUpdate"/>, containing patch operations to perform on the todoitem.</param>
        [HttpPatch("{id:guid}")]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
        [ProducesResponseType(422)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> PartiallyUpdateTodoItem(Guid id, [FromBody]JsonPatchDocument<TodoItemToUpdate> patchDoc)
        {
            if (patchDoc == null)
            {
                return BadRequest();
            }

            var entity = await _service.GetById(id);
            if (entity == null)
            {
                return NotFound();
            }

            var todoItemToPatch = _mapper.Map<TodoItemToUpdate>(entity);

            patchDoc.ApplyTo(todoItemToPatch, ModelState);
            TryValidateModel(todoItemToPatch);

            if (!ModelState.IsValid)
            {
                return UnprocessableEntity(ModelState);
            }

            _mapper.Map(todoItemToPatch, entity);
            if (!await _service.Update(entity))
            {
                throw new ApiException($"Update of todo item {id} failed on save.");
            }

            return NoContent();
        }
    }
}