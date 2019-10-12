using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.Logging;
using Moq;
using UCB.Template.Domain;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;
using UCB.Template.Domain.Services;
using UCB.Template.WebApi.Paging;
using UCB.Template.WebApi.TodoItems;
using Xunit;
using Models = UCB.Template.WebApi.TodoItems.Models;

namespace UCB.Template.WebApi.Tests.Controllers.TodoItems
{
    public class ControllerTests
    {
        private readonly TodoItemsController _controller;
        private readonly Mock<ITodoItemService> _serviceMock;

        public ControllerTests()
        {
            AutoMapper.Mapper.Reset();
            AutoMapper.Mapper.Initialize(x => x.AddProfiles(typeof(TodoItemsController)));

            var logger = Mock.Of<ILogger<TodoItemsController>>();
            _serviceMock = new Mock<ITodoItemService>();
            _controller = new TodoItemsController(AutoMapper.Mapper.Instance, _serviceMock.Object, logger) { ControllerContext = new ControllerContext() };
        }

        [Fact]
        public async Task GetTodoItems_Should_ReturnOkObjectResult()
        {
            // Arrange
            _serviceMock
                .Setup(x => x.Find(It.IsAny<TodoItemFilter>(), It.IsAny<Sort<TodoItem>>(), It.IsAny<int>(), It.IsAny<int>()))
                .ReturnsAsync(new Domain.Page<TodoItem>(new List<TodoItem>(), 2, 5, 100));
            var pageData = new PageData
            {
                Page = 2,
                PageSize = 5
            };
            var filter = new Models.Filter
            {
                Title = "some",
                Description = "no description",
                IsCompleted = false
            };

            // Act
            var result = await Execute(() => _controller.GetTodoItems(filter, null, pageData));

            // Assert
            Assert.Empty(result.Items);
            Assert.Equal(2, result.Index);
            Assert.Equal(5, result.Size);
            Assert.Equal(100, result.TotalItems);
            Assert.Equal(20, result.TotalPages);
        }

        private async Task<T> Execute<T>(Func<Task<ActionResult<T>>> func)
        {
            var actionResult = await func();

            if (actionResult.Result == null)
            {
                return actionResult.Value;
            }

            Assert.IsType<OkObjectResult>(actionResult.Result);

            return (T)(actionResult.Result as OkObjectResult).Value;

        }

        [Fact]
        public async Task GetTodoItem_Should_ReturnTodoItem()
        {
            // Arrange
            var item = new TodoItem { Title = "B", Description = "D", IsCompleted = true };
            _serviceMock
                .Setup(x => x.GetById(It.IsAny<Guid>()))
                .ReturnsAsync(item);

            // Act
            var actual = await Execute(() => _controller.GetTodoItem(Guid.NewGuid()));

            // Assert
            Assert.Equal(item.Id, actual.Id);
            Assert.Equal(item.Title, actual.Title);
            Assert.Equal(item.Description, actual.Description);
            Assert.Equal(item.IsCompleted, actual.IsCompleted);
        }

        [Fact]
        public async Task GetTodoItem_Should_ReturnNotFound()
        {
            // Arrange
            _serviceMock.Setup(x => x.GetById(It.IsAny<Guid>())).ReturnsAsync((TodoItem)null);

            // Act
            var result = await _controller.GetTodoItem(Guid.NewGuid());

            // Assert
            Assert.IsType<ActionResult<Models.TodoItem>>(result);
            Assert.IsType<NotFoundResult>(result.Result);
        }

        [Fact]
        public async Task CreateTodoItem_Should_ReturnCreated()
        {
            // Arrange
            var model = new Models.TodoItemToCreate
            {
                Title = "Test item"
            };

            _serviceMock.Setup(x => x.Create(It.IsAny<TodoItem>())).ReturnsAsync(true);

            // Act
            var result = await _controller.CreateTodoItem(model);

            // Assert
            Assert.IsType<ActionResult<Models.TodoItem>>(result);
            Assert.IsType<CreatedAtRouteResult>(result.Result);
        }

        [Fact]
        public async Task CreateTodoItem_Should_ReturnBadRequest()
        {
            // Act
            var result = await _controller.CreateTodoItem(null);

            // Assert
            _serviceMock.VerifyNoOtherCalls();
            Assert.IsType<ActionResult<Models.TodoItem>>(result);
            Assert.IsType<BadRequestResult>(result.Result);
        }

        [Fact]
        public async Task CreateTodoItem_Should_ReturnUnprocessableEntity()
        {
            // Arrange
            var model = new Models.TodoItemToCreate
            {
                Description = "Test item"
            };
            _controller.ModelState.AddModelError(nameof(Models.TodoItemToCreate.Title), "Title is a required field");

            // Act
            var result = await _controller.CreateTodoItem(model);

            // Assert
            _serviceMock.VerifyNoOtherCalls();
            Assert.IsType<ActionResult<Models.TodoItem>>(result);
            Assert.IsType<UnprocessableEntityObjectResult>(result.Result);
        }

        [Fact]
        public async Task CreateTodoItem_Should_ThrowException_WhenSaveFails()
        {
            // Arrange
            var model = new Models.TodoItemToCreate
            {
                Title = "Test item"
            };

            _serviceMock.Setup(x => x.Create(It.IsAny<TodoItem>())).ReturnsAsync(false);

            // Act && Assert
            await Assert.ThrowsAsync<ApiException>(() => _controller.CreateTodoItem(model));
        }

        [Fact]
        public async Task ReplaceTodoItem_Should_ReturnNoContent()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };
            var model = new Models.TodoItemToUpdate
            {
                Title = "Test updated"
            };

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Update(It.IsAny<TodoItem>())).ReturnsAsync(true);

            // Act
            var result = await _controller.ReplaceTodoItem(guid, model);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(model.Title, entity.Title);
        }

        [Fact]
        public async Task ReplaceTodoItem_Should_ReturnBadRequest()
        {
            // Act
            var result = await _controller.ReplaceTodoItem(Guid.NewGuid(), null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task ReplaceTodoItem_Should_ReturnUnprocessableEntity()
        {
            // Arrange
            var model = new Models.TodoItemToUpdate
            {
                Description = "Test updated"
            };
            _controller.ModelState.AddModelError(nameof(Models.TodoItemToUpdate.Title), "Title is required");

            // Act
            var result = await _controller.ReplaceTodoItem(Guid.NewGuid(), model);

            // Assert
            Assert.IsType<UnprocessableEntityObjectResult>(result);
        }

        [Fact]
        public async Task ReplaceTodoItem_Should_ReturnNotFound()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var model = new Models.TodoItemToUpdate
            {
                Title = "Test updated"
            };

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync((TodoItem)null);

            // Act
            var result = await _controller.ReplaceTodoItem(guid, model);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task ReplaceTodoItem_Should_ThrowException_WhenSaveFails()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };
            var model = new Models.TodoItemToUpdate
            {
                Title = "Test updated"
            };

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Update(It.IsAny<TodoItem>())).ReturnsAsync(false);

            // Act && Assert
            await Assert.ThrowsAsync<ApiException>(() => _controller.ReplaceTodoItem(guid, model));
        }

        [Fact]
        public async Task RemoveTodoItem_Should_ReturnNoContent()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Delete(It.IsAny<Guid>())).ReturnsAsync(true);

            // Act
            var result = await _controller.RemoveTodoItem(guid);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }

        [Fact]
        public async Task RemoveTodoItem_Should_ReturnNotFound()
        {
            // Arrange
            var guid = Guid.NewGuid();

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync((TodoItem)null);

            // Act
            var result = await _controller.RemoveTodoItem(guid);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task RemoveTodoItem_Should_ThrowException_WhenSaveFails()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Delete(It.IsAny<Guid>())).ReturnsAsync(false);

            // Act && Assert
            await Assert.ThrowsAsync<ApiException>(() => _controller.RemoveTodoItem(guid));
        }

        [Fact]
        public async Task PartiallyUpdateTodoItem_Should_ReturnNoContent()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var newTitle = "Test Patched";
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };
            var patchDoc = new JsonPatchDocument<Models.TodoItemToUpdate>().Replace(x => x.Title, newTitle);

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Update(It.IsAny<TodoItem>())).ReturnsAsync(true);

            _controller.ObjectValidator = Mock.Of<IObjectModelValidator>();

            // Act
            var result = await _controller.PartiallyUpdateTodoItem(guid, patchDoc);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(newTitle, entity.Title);
        }

        [Fact]
        public async Task PartiallyUpdateTodoItem_Should_ReturnBadRequest()
        {
            // Act
            var result = await _controller.PartiallyUpdateTodoItem(Guid.NewGuid(), null);

            // Assert
            Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task PartiallyUpdateTodoItem_Should_ReturnUnprocessableEntity()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var newTitle = "Todo item got patched but its title became longer than the defined maximum length of one hundred characters.";
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };
            var patchDoc = new JsonPatchDocument<Models.TodoItemToUpdate>().Replace(x => x.Title, newTitle);

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Update(It.IsAny<TodoItem>())).ReturnsAsync(true);

            var objectValidatorMock = new Mock<IObjectModelValidator>();
            objectValidatorMock
                .Setup(x => x.Validate(_controller.ControllerContext, It.IsAny<ValidationStateDictionary>(), It.IsAny<string>(), It.IsAny<object>()))
                .Callback(() => { _controller.ModelState.AddModelError(nameof(Models.TodoItemToUpdate.Title), "Title has exceeded the max length of 100 characters."); });

            _controller.ObjectValidator = objectValidatorMock.Object;

            // Act
            var result = await _controller.PartiallyUpdateTodoItem(guid, patchDoc);

            // Assert
            Assert.IsType<UnprocessableEntityObjectResult>(result);
        }

        [Fact]
        public async Task PartiallyUpdateTodoItem_Should_ReturnNotFound()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var patchDoc = new JsonPatchDocument<Models.TodoItemToUpdate>().Copy(x => x.Title, x => x.Description);

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync((TodoItem)null);

            // Act
            var result = await _controller.PartiallyUpdateTodoItem(guid, patchDoc);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }

        [Fact]
        public async Task PartiallyUpdateTodoItem_Should_ThrowException_WhenSaveFails()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var newTitle = "Test Patched";
            var entity = new TodoItem
            {
                Id = guid,
                Title = "Test"
            };
            var patchDoc = new JsonPatchDocument<Models.TodoItemToUpdate>().Replace(x => x.Title, newTitle);

            _serviceMock.Setup(x => x.GetById(guid)).ReturnsAsync(entity);
            _serviceMock.Setup(x => x.Update(It.IsAny<TodoItem>())).ReturnsAsync(false);

            _controller.ObjectValidator = Mock.Of<IObjectModelValidator>();

            // Act && Assert
            await Assert.ThrowsAsync<ApiException>(() => _controller.PartiallyUpdateTodoItem(guid, patchDoc));
        }
    }
}