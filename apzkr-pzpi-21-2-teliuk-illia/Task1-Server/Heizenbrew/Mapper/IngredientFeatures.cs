using AutoMapper;
using Core.Models.Equipment;
using Core.Models.Ingredient;
using Infrustructure.Dto.Equipment;
using Infrustructure.Dto.Ingredient;
using static System.Net.WebRequestMethods;

namespace heisenbrew_api.Mapper
{
    public class IngredientFeatures : Profile
    {
        public IngredientFeatures()
        {
            CreateMap<Ingredient, IngredientDto>();
            CreateMap<CreateIngredientDto, Ingredient>();
            CreateMap<UpdateIngredientDto, Ingredient>();

            CreateMap<BrewerIngredient, BrewerIngredientDto>()
                .ForCtorParam(nameof(BrewerIngredientDto.Name), otp => otp.MapFrom(src => src.Ingredient.Name));

            CreateMap<CreateRecipeIngredientDto, RecipeIngredient>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IngredientId, opt => opt.MapFrom(src => src.Id));

            CreateMap<UpdateRecipeIngredientDto, RecipeIngredient>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.IngredientId, opt => opt.MapFrom(src => src.Id));

            CreateMap<RecipeIngredient, RecipeIngredientDto>()
                .ForCtorParam(nameof(RecipeIngredientDto.Id), otp => otp.MapFrom(src => src.IngredientId))
                .ForCtorParam(nameof(RecipeIngredientDto.Name), otp => otp.MapFrom(src => src.Ingredient.Name));
;
        }
    }
}
