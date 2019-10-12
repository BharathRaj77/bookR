using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace UCB.Template.WebApi.Tests.Controllers.ApiVersion
{
    [Trait("Category", "Integration")]
    public class ControllerIntegrationTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly WebApplicationFactory<Startup> _factory;

        public ControllerIntegrationTests(WebApplicationFactory<Startup> factory)
        {
            _factory = factory;
        }

        [Fact(Skip="Issues with Azure Key Vault")]
        public async Task GetVersion_ShouldReturn_CorrectVersion()
        {
            // Arrange
            var expectedVersion = typeof(Startup).Assembly.GetName().Version.ToString();
            var client = _factory.CreateClient();

            // Act
            var response = await client.GetAsync("/api/version");

            // Assert
            response.EnsureSuccessStatusCode();
            Assert.Equal("application/json; charset=utf-8", response.Content.Headers.ContentType.ToString());

            var actualVersion = await response.Content.ReadAsAsync<string>();
            Assert.Equal(expectedVersion, actualVersion);
        }
    }
}
