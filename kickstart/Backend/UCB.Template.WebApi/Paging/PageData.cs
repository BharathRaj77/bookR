using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace UCB.Template.WebApi.Paging
{
    /// <summary>
    /// Contains the requested page and page size.
    /// </summary>
    public class PageData
    {
        private int _page = 1;
        private int _pageSize = 10;

        /// <summary>
        /// Gets or sets the page.
        /// </summary>
        [FromQuery]
        public int Page
        {
            get => _page;
            set => _page = value < 1 ? 1 : value;
        }

        /// <summary>
        /// Gets or sets the page size.
        /// </summary>
        /// <remarks>When setting a new page size, the page size is rounded up to the next valid page size.</remarks>
        /// <seealso cref="ValidPageSizes"/>
        [FromQuery]
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = GetValidPageSize(value);
        }

        /// <summary>
        /// Returns the valid page sizes in an ascending order.
        /// </summary>
        public static IEnumerable<int> ValidPageSizes
        {
            get
            {
                yield return 10;
                yield return 20;
                yield return 50;
                yield return 100;
            }
        }

        private int GetValidPageSize(int requestedPageSize)
        {
            var pageSize = ValidPageSizes.FirstOrDefault(x => requestedPageSize <= x);
            return pageSize == 0 ? ValidPageSizes.Max() : pageSize;
        }
    }
}