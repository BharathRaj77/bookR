using System.Linq;
using UCB.Template.WebApi.Paging;
using Xunit;

namespace UCB.Template.WebApi.Tests.Paging
{
    public class PageDataTests
    {
        private PageData _pageData = new PageData();

        [Fact]
        public void Page_Should_NotAllowValuesLessThanOne()
        {
            _pageData.Page = 0;

            Assert.Equal(1, _pageData.Page);
        }

        [Fact]
        public void Page_Should_AllowABigValue()
        {
            _pageData.Page = int.MaxValue;

            Assert.Equal(int.MaxValue, _pageData.Page);
        }

        [Fact]
        public void PageSize_Should_FixInvalidLowValue()
        {
            var expected = PageData.ValidPageSizes.First();

            _pageData.PageSize = 0;

            Assert.Equal(expected, _pageData.PageSize);
        }

        [Fact]
        public void PageSize_Should_FixInvalidInnerValue()
        {
            var expected = PageData.ValidPageSizes.Skip(1).First();

            _pageData.PageSize = expected - 2;

            Assert.Equal(expected, _pageData.PageSize);
        }

        [Fact]
        public void PageSize_Should_FixInvalidBigValue()
        {
            var expected = PageData.ValidPageSizes.Max();

            _pageData.PageSize = int.MaxValue;

            Assert.Equal(expected, _pageData.PageSize);
        }
    }
}
