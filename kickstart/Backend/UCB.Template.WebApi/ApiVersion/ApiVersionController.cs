using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace UCB.Template.WebApi.ApiVersion
{
    [Route("api/version")]
    [ApiController]
    [AllowAnonymous]
    public class ApiVersionController : ControllerBase
    {
        /// <summary>
        /// Returns the current version of this Web API
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(string), 200)]
        public IActionResult GetVersion()
        {
            var version = typeof(ApiVersionController).Assembly.GetName().Version;
            return Ok(version.ToString());
        }
    }
}