using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DataAccess.Entities
{
    public class Library
    {
        [Key]
        public int Id { get; set; }

        public string LibraryKey { get; set; }

        public User User { get; set; }

    }
}
