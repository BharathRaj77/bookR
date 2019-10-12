namespace UCB.Template.WebApi.Paging
{
    public class AutomapperProfile : AutoMapper.Profile
    {
        public AutomapperProfile()
        {
            CreateMap(typeof(Domain.Page<>), typeof(Page<>));
        }
    }
}