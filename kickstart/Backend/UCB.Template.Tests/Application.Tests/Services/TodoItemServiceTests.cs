using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Moq;
using UCB.Sherpa.Data.Abstractions.Interfaces;
using UCB.Template.Application.Services;
using UCB.Template.Domain;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;
using UCB.Template.Domain.Repositories;
using Xunit;

namespace UCB.Template.Application.Tests.Services
{
    public class TodoItemServiceTests
    {
        private readonly TodoItemService _service;
        private readonly Mock<ITodoItemRepository> _repositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;

        public TodoItemServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);
            _repositoryMock = new Mock<ITodoItemRepository>(MockBehavior.Strict);

            _service = new TodoItemService(_unitOfWorkMock.Object, _repositoryMock.Object);
        }

        [Fact]
        public async Task Find_Should_ReturnRepositoryReturn()
        {
            // Arrange
            var expected = new Page<TodoItem>(new List<TodoItem>(), 1, 10, 0);
            _repositoryMock
                .Setup(x => x.Find(null, null, 1, 10))
                .ReturnsAsync(expected);

            // Act
            var actual = await _service.Find(null, null, 1, 10);

            // Assert
            Assert.Same(expected, actual);
        }

        [Fact]
        public async Task GetById_Should_ReturnRepositoryReturn()
        {
            // Arrange
            var guid = Guid.NewGuid();
            var expected = new TodoItem();
            _repositoryMock
                .Setup(x => x.GetById(guid))
                .ReturnsAsync(expected);

            // Act
            var actual = await _service.GetById(guid);

            // Assert
            Assert.Same(expected, actual);
        }

        [Fact]
        public async Task Create_Should_CallRepository()
        {
            // Arrange
            var item = new TodoItem();
            _repositoryMock
                .Setup(x => x.Create(item))
                .Returns(Task.CompletedTask);
            _unitOfWorkMock
                .Setup(x => x.Save())
                .ReturnsAsync(true);

            // Act
            var actual = await _service.Create(item);

            // Assert
            Assert.True(actual);
            _repositoryMock.Verify(x => x.Create(item), Times.Once());
            _unitOfWorkMock.Verify(x => x.Save(), Times.Once());
        }

        [Fact]
        public async Task Update_Should_CallRepository()
        {
            // Arrange
            var item = new TodoItem();
            _repositoryMock
                .Setup(x => x.Update(item))
                .Returns(item);
            _unitOfWorkMock
                .Setup(x => x.Save())
                .ReturnsAsync(true);

            // Act
            var actual = await _service.Update(item);

            // Assert
            Assert.True(actual);
            _repositoryMock.Verify(x => x.Update(item), Times.Once());
            _unitOfWorkMock.Verify(x => x.Save(), Times.Once());
        }

        [Fact]
        public async Task Delete_Should_CallRepository()
        {
            // Arrange
            var itemId = Guid.NewGuid();
            _repositoryMock
                .Setup(x => x.Delete(itemId))
                .Returns(Task.CompletedTask);
            _unitOfWorkMock
                .Setup(x => x.Save())
                .ReturnsAsync(true);

            // Act
            var actual = await _service.Delete(itemId);

            // Assert
            Assert.True(actual);
            _repositoryMock.Verify(x => x.Delete(itemId), Times.Once());
            _unitOfWorkMock.Verify(x => x.Save(), Times.Once());
        }
    }
}