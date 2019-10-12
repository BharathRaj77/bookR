using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Apps.Repositories
{
    public interface ICreateLibraryRepository
    {
        string Add(User user, Library library);
    }
}
