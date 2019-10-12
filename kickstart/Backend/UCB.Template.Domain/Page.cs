using System;
using System.Collections.Generic;

namespace UCB.Template.Domain
{
    /// <summary>
    /// Represents a page of data
    /// </summary>
    /// <typeparam name="T">Type of data represented in this page.</typeparam>
    public class Page<T>
    {
        /// <summary>
        /// Creates a new page.
        /// </summary>
        /// <param name="items">The items belonging to the current page.</param>
        /// <param name="index">The number of the current page.</param>
        /// <param name="size">The size of each page.</param>
        /// <param name="totalItems">The total number of available items.</param>
        public Page(IEnumerable<T> items, int index, int size, int totalItems)
        {
            Items = items;
            Index = index;
            Size = size;
            TotalItems = totalItems;

            TotalPages = (int)Math.Ceiling(totalItems * 1.0 / size);
        }

        /// <summary>
        /// Returns the items
        /// </summary>
        public IEnumerable<T> Items { get; }

        /// <summary>
        /// Returns the page index
        /// </summary>
        public int Index { get; }

        /// <summary>
        /// Returns the page size
        /// </summary>
        public int Size { get; }

        /// <summary>
        /// Returns the number of available pages
        /// </summary>
        public int TotalPages { get; }

        /// <summary>
        /// Returns the total number of items across all pages
        /// </summary>
        public int TotalItems { get; }
    }
}