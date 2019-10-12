using System.Collections.Generic;

namespace UCB.Template.WebApi.Paging
{
    /// <summary>
    /// Represents a page of data in the API.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <remarks>
    /// This type is almost similar to the Domain Page, but is used to map results
    /// from the domain types to the API types.
    /// </remarks>
    public class Page<T>
    {
        /// <summary>
        /// Returns the items
        /// </summary>
        public IEnumerable<T> Items { get; set; }

        /// <summary>
        /// Returns the page index
        /// </summary>
        public int Index { get; set; }

        /// <summary>
        /// Returns the page size
        /// </summary>
        public int Size { get; set; }

        /// <summary>
        /// Returns the number of available pages
        /// </summary>
        public int TotalPages { get; set; }

        /// <summary>
        /// Returns the total number of items across all pages
        /// </summary>
        public int TotalItems { get; set; }
    }
}