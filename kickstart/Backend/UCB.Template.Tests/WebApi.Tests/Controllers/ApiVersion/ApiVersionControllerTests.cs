using Microsoft.AspNetCore.Mvc;
using UCB.Template.WebApi.ApiVersion;
using Xunit;

namespace UCB.Template.WebApi.Tests.Controllers.ApiVersion
{
    public class ControllerTests
    {
        [Fact(Skip = "Issues with Azure Key Vault")]
        public void GetVersion_ShouldReturn_OkObjectResult()
        {
            // Arrange
            var controller = new ApiVersionController();

            // Act
            var result = controller.GetVersion();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}