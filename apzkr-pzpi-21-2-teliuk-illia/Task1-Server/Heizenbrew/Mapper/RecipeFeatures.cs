using AutoMapper;
using Core.Models;
using Core.Models.Equipment;
using Infrustructure.Dto.Equipment;
using Infrustructure.Dto.Recipe;

namespace heisenbrew_api.Mapper
{
    public class RecipeFeatures : Profile
    {
        public RecipeFeatures()
        {
            CreateMap<Recipe, RecipeDto>()
                .ForCtorParam(nameof(RecipeDto.BrewerName), otp => otp.MapFrom(src => $"{src.Brewer.FirstName} {src.Brewer.LastName}"))
                .ForCtorParam(nameof(RecipeDto.Ingredients), otp => otp.MapFrom(src => src.Ingredients));

            CreateMap<CreateRecipeDto, Recipe>();
            CreateMap<UpdateRecipeDto, Recipe>();
        }
    }
}
