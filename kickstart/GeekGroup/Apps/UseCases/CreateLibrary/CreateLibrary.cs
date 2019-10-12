using Apps.Interfaces;
using Apps.Repositories;
using Domain;
using System;
using System.Collections.Generic;
using System.Text;

namespace Apps.UseCases.CreateLibrary
{
    public class CreateLibrary : ICreateLibrary
    {
        private ICreateLibraryRepository _createLibraryRepository;
        public CreateLibrary(ICreateLibraryRepository createLibraryRepository)
        {       
            _createLibraryRepository = createLibraryRepository;
        }
        public string create(string username)
        {
            User user = new User();
            user.Name = username;
            Library lib = new Library();
            lib.GUID = new Guid();

           var data= _createLibraryRepository.Add(user, lib);
            return data;
        }
    }
}
