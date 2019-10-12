using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess
{
    public class bookRDbContext : DbContext
    {
        public bookRDbContext( DbContextOptions options ) : base (options)
        {
                
        }
        
       

        public DbSet<User> Users { get; set; }
        public DbSet<Library> Libraries { get; set; }
        public DbSet<Book> Books { get; set; }
    }
}
