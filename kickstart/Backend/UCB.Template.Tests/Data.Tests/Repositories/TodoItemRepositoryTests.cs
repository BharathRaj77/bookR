using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Moq;
using UCB.Sherpa.Data.Abstractions.Interfaces;
using UCB.Template.Data.Repositories;
using UCB.Template.Domain;
using UCB.Template.Domain.Filters;
using UCB.Template.Domain.Models;
using Xunit;

namespace UCB.Template.Data.Tests.Repositories
{
    public class TodoItemRepositoryTests
    {
        private readonly TodoItemRepository _repository;
        private readonly Mock<IRepository<TodoItem, Guid>> _repositoryMock;

        public TodoItemRepositoryTests()
        {
            _repositoryMock = new Mock<IRepository<TodoItem, Guid>>();

            var unitOfWorkMock = new Mock<IUnitOfWork>();
            unitOfWorkMock
                .Setup(x => x.GetRepository<TodoItem>())
                .Returns(_repositoryMock.Object);

            _repository = new TodoItemRepository(unitOfWorkMock.Object);
        }

        [Fact]
        public async Task Find_Should_CallFindAll()
        {
            // Arrange
            _repositoryMock.Setup(x => x.FindAll(null, false)).Returns(new TestAsyncEnumerable<TodoItem>(new List<TodoItem>()));

            // Act
            await _repository.Find(null, null, 1, 10);

            // Assert
            _repositoryMock.Verify(x => x.FindAll(null, false), Times.Once());
            _repositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task Find_Should_ReturnItemsFilteredByTitle()
        {
            // Arrange
            SetupForFind();
            var filter = new TodoItemFilter { Title = "Piano" };

            // Act
            var results = await _repository.Find(filter, null, 1, 10);

            // Assert
            AssertOneResult("Piano leassons", results);
        }

        private List<TodoItem> SetupForFind()
        {
            var items = CreateItems();

            _repositoryMock
                .Setup(x => x.FindAll(null, false))
                .Returns(new TestAsyncEnumerable<TodoItem>(items));

            return items;
        }

        private static List<TodoItem> CreateItems()
        {
            var items = new List<TodoItem>(24)
            {
                new TodoItem { Title = "Laundry", Description="It's that time of the week, again"},
                new TodoItem { Title = "Piano leassons", Description="Monday and Friday"},
                new TodoItem { Title = "Make dinner reservation", Description="Time to go out"},
                new TodoItem { Title = "Completed", Description = "This item was completed", IsCompleted = true },
            };

            for(var  i = 0; i < 20; i++)
            {
                items.Add(new TodoItem { Title = "Sample - Item " + i, Description = "None" });
            }

            return items;
        }

        private static void AssertOneResult(string expectedTitle, Page<TodoItem> results)
        {
            Assert.Equal(10, results.Size);
            Assert.Equal(1, results.TotalItems);
            Assert.Equal(1, results.TotalPages);
            Assert.Equal(expectedTitle, results.Items.Single().Title);
        }

        [Fact]
        public async Task Find_Should_ReturnItemsFilteredByDescription()
        {
            // Arrange
            SetupForFind();
            var filter = new TodoItemFilter { Description = "time of the week" };

            // Act
            var results = await _repository.Find(filter, null, 1, 10);

            // Assert
            AssertOneResult("Laundry", results);
        }

        [Fact]
        public async Task Find_Should_ReturnItemsFilteredByIsCompleted()
        {
            // Arrange
            SetupForFind();
            var filter = new TodoItemFilter { IsCompleted = true };

            // Act
            var results = await _repository.Find(filter, null, 1, 10);

            // Assert
            AssertOneResult("Completed", results);
        }

        [Fact]
        public async Task Find_Should_ReturnItemsSortedByTitleAsc()
        {
            // Arrange
            var expectedItems = SetupForFind().OrderBy(x => x.Title).Take(10).Select(x => x.Id).ToList();
            var sort = new Sort<TodoItem>(item => item.Title, true);

            // Act
            var results = await _repository.Find(null, sort, 1, 10);

            // Assert
            Assert.True(expectedItems.SequenceEqual(results.Items.Select(x => x.Id)));
        }

        [Fact]
        public async Task Find_Should_ReturnItemsSortedByTitleDesc()
        {
            // Arrange
            var expectedItems = SetupForFind().OrderByDescending(x => x.Title).Take(10).Select(x => x.Id).ToList();
            var sort = new Sort<TodoItem>(item => item.Title, false);

            // Act
            var results = await _repository.Find(null, sort, 1, 10);

            // Assert
            Assert.True(expectedItems.SequenceEqual(results.Items.Select(x => x.Id)));
        }

        [Fact]
        public async Task Find_Should_ReturnItemsPaged()
        {
            // Arrange
            var items = SetupForFind();

            // Act
            var results = await _repository.Find(null, null, 2, 5);

            // Assert
            Assert.Equal(5, results.Size);
            Assert.Equal(2, results.Index);
            Assert.Equal(items.Count, results.TotalItems);
            Assert.Equal(5, results.TotalPages);
        }

        [Fact]
        public async Task GetById_Should_CallFindById()
        {
            // Arrange
            var guid = Guid.NewGuid();
            _repositoryMock.Setup(x => x.FindById(It.IsAny<Guid>(), true)).ReturnsAsync(new TodoItem());

            // Act
            await _repository.GetById(guid);

            // Assert
            _repositoryMock.Verify(x => x.FindById(guid, true), Times.Once());
            _repositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task Create_Should_CallCreate()
        {
            // Arrange
            var item = new TodoItem();
            _repositoryMock
                .Setup(x => x.Create(It.IsAny<TodoItem>()))
                .Returns(Task.CompletedTask);

            // Act
            await _repository.Create(item);

            // Assert
            _repositoryMock.Verify(x => x.Create(item), Times.Once());
            _repositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public void Update_Should_CallUpdate()
        {
            // Arrange
            var item = new TodoItem();
            var expected = new TodoItem();
            _repositoryMock
                .Setup(x => x.Update(It.IsAny<TodoItem>()))
                .Returns(expected);

            // Act
            var actual = _repository.Update(item);

            // Assert
            Assert.Same(expected, actual);
            _repositoryMock.Verify(x => x.Update(item), Times.Once());
            _repositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task Delete_Should_CallDelete()
        {
            // Arrange
            var guid = Guid.NewGuid();
            _repositoryMock.Setup(x => x.Delete(It.IsAny<Guid>())).Returns(Task.CompletedTask);

            // Act
            await _repository.Delete(guid);

            // Assert
            _repositoryMock.Verify(x => x.Delete(guid), Times.Once());
            _repositoryMock.VerifyNoOtherCalls();
        }
    }
}