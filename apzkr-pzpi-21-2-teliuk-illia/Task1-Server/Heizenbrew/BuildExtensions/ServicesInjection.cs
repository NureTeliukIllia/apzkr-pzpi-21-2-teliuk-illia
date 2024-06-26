﻿


using BLL.IdentityManagement.Interfaces;
using BLL.ProfileManagement;
using BLL.IdentityManagement;
using BLL.EquipmentManagement;
using BLL.IngredientManagement;
using BLL.RecipeManagement;
using BLL.BrewingManagement;

namespace heisenbrew_api.BuildExtensions
{
    internal static class ServicesInjection
    {
        internal static void AddServices(this IServiceCollection services)
        {
            services.AddScoped<ITokenGenerator, JwtTokenGenerator>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IProfileService, ProfileService>();
            services.AddScoped<IEquipmentService, EquipmentService>();
            services.AddScoped<IIngredientService, IngredientService>();
            services.AddScoped<IRecipeService, RecipeService>();
            services.AddScoped<IBrewingService, BrewingService>();

        }
    }
}
