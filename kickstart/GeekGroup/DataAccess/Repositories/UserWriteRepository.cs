using Apps.Repositories;
using System;
using System.Collections.Generic;
using System.Text;
using Domain;

namespace DataAccess.Repositories
{
    public class UserWriteRepository : ICreateLibraryRepository
    {
        private bookRDbContext _bookRDbContext;
        public UserWriteRepository(bookRDbContext bookRDbContext)
        {
            _bookRDbContext = bookRDbContext;
        }
        public string Add(User _user, Library library)
        {
            Entities.User user = new Entities.User();
            user.Name = _user.Name;
            Entities.Library lib = new Entities.Library();
            lib.LibraryKey = Guid.NewGuid().ToString();
            lib.User = user;
            _bookRDbContext.Users.Add(user);
            _bookRDbContext.Libraries.Add(lib);
            _bookRDbContext.SaveChanges();
            return lib.LibraryKey;
        }
    }
}
