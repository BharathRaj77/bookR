using UCB.Template.WebApi.TodoItems.Models;
using Xunit;

namespace UCB.Template.WebApi.Tests.Controllers.TodoItems
{
    public class TodoItemTests
    {
        Domain.Models.TodoItem sampleItem = new Domain.Models.TodoItem
        {
            Title = "A",
            Description = "B",
            IsCompleted = true
        };

        [Fact]
        public void GetSortExpression_Should_ReturnAscendingWhenThereIsNoDirectionSign()
        {
            var sort = TodoItem.GetSortExpression("title");

            Assert.True(sort.Ascending);
            Assert.Equal(sampleItem.Title, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnAscendingWhenThereIsPlusSign()
        {
            var sort = TodoItem.GetSortExpression("+title");

            Assert.True(sort.Ascending);
            Assert.Equal(sampleItem.Title, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnDescendingWhenThereIsMinusSign()
        {
            var sort = TodoItem.GetSortExpression("-title");

            Assert.False(sort.Ascending);
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForTitle()
        {
            var sort = TodoItem.GetSortExpression("title");

            Assert.Equal(sampleItem.Title, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForDescription()
        {
            var sort = TodoItem.GetSortExpression("description");

            Assert.Equal(sampleItem.Description, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForIsCompleted()
        {
            var sort = TodoItem.GetSortExpression("isCompleted");

            Assert.Equal(sampleItem.IsCompleted, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForIdWhenParameterIsNull()
        {
            var sort = TodoItem.GetSortExpression(null);

            Assert.True(sort.Ascending);
            Assert.Equal(sampleItem.Id, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForIdWhenParameterIsEmpty()
        {
            var sort = TodoItem.GetSortExpression(string.Empty);

            Assert.True(sort.Ascending);
            Assert.Equal(sampleItem.Id, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForIdWhenParameterContainsOnlyTheOrder()
        {
            var sort = TodoItem.GetSortExpression("-");

            Assert.False(sort.Ascending);
            Assert.Equal(sampleItem.Id, sort.Expression.Compile().Invoke(sampleItem));
        }

        [Fact]
        public void GetSortExpression_Should_ReturnSortObjectForIdWhenParameterIsInvalid()
        {
            var sort = TodoItem.GetSortExpression("-NoProperty");

            Assert.False(sort.Ascending);
            Assert.Equal(sampleItem.Id, sort.Expression.Compile().Invoke(sampleItem));
        }
    }
}
