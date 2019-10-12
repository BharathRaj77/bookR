namespace UCB.Template.WebApi.TodoItems.Models
{
    public class AutoMapperProfile : AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Domain.Models.TodoItem, TodoItem>();

            CreateMap<TodoItemToCreate, Domain.Models.TodoItem>();
            CreateMap<TodoItemToUpdate, Domain.Models.TodoItem>();
        }
    }
}