using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apps.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Web.Api.UseCases.CreateLibrary
{
    [Route("api/[controller]")]
    [ApiController]
    public class CreateLibraryController : ControllerBase
    {
        private ICreateLibrary _createLibrary;
        public CreateLibraryController(ICreateLibrary createLibrary)
        {
            _createLibrary = createLibrary;
        }
        [HttpGet("{user}")]
        public ActionResult create(string user)
        {
            var guid = _createLibrary.create(user);
            return new JsonResult(guid);
        }
    }
}