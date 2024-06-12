using AutoMapper;
using Core;
using Core.Models;
using Core.Models.Ingredient;
using DAL;
using Infrustructure.Dto.Ingredient;
using Infrustructure.Dto.Recipe;
using Infrustructure.Dto.UserProfile;
using Infrustructure.ErrorHandling.Errors.Base;
using Infrustructure.ErrorHandling.Errors.ServiceErrors;
using Infrustructure.ErrorHandling.Exceptions.Services.Recipe;
using Infrustructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BLL.RecipeManagement
{
    public class RecipeService : IRecipeService
    {
        private readonly ILogger<RecipeService> _logger;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;


        public RecipeService(ILogger<RecipeService> logger, IMapper mapper, ApplicationDbContext context, IHttpContextAccessor contextAccessor)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
            _contextAccessor = contextAccessor;
        }


        public async Task<Result<string, Error>> CreateRecipeAsync(CreateRecipeDto createRecipeDto)
        {
            try
            {
                var isIdValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (isIdValid is false)
                {
                    return UserErrors.InvalidUserId;
                }

                var brewer = await _context
                    .Brewers
                    .FirstOrDefaultAsync(x => x.Id == userId);

                if (brewer is null)
                {
                    return ProfileServiceErrors.UserNotFoundError;
                }

                var recipe = _mapper.Map<Recipe>(createRecipeDto);
                recipe.BrewerId = userId;


                await _context.Recipes.AddAsync(recipe);
/*                brewer.Recipes.Add(recipe);
*/
                await _context.SaveChangesAsync();

                return $"Successfully created the \"{recipe.Title}\" recipe!";
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.CreateRecipeAsync ERROR: {ex.Message}");

                return RecipeServiceErrors.CreateRecipeError;
            }
        }

        public async Task<Result<string, Error>> DeleteRecipeAsync(Guid recipeId)
        {
            try
            {
                var recipe = await _context.Recipes.FirstOrDefaultAsync(r => r.Id == recipeId);

                if (recipe is null)
                {
                    return RecipeServiceErrors.GetRecipeByIdError;
                }

                _context.Recipes.Remove(recipe);
                await _context.SaveChangesAsync();

                return "Successfully deleted the recipe!";
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.DeleteRecipeAsync ERROR: {ex.Message}");

                return RecipeServiceErrors.DeleteRecipeError;
            }
        }

        public async Task<Result<List<RecipeDto>, Error>> GetOwnRecipesAsync()
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var result = await GetFilteredRecipesAsync(_context.Recipes.Where(r => r.BrewerId == userId));
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetOwnRecipesAsync ERROR: {ex.Message}");
                return RecipeServiceErrors.GetRecipeListError;
            }
        }

        public async Task<Result<RecipeDto, Error>> GetRecipeByIdAsync(Guid recipeId)
        {
            try
            {

                var recipe = await _context.Recipes.Include(r => r.Brewer).Include(r => r.Ingredients).ThenInclude(rI => rI.Ingredient).FirstOrDefaultAsync(r => r.Id == recipeId);

                if(recipe is null)
                {
                    return RecipeServiceErrors.GetRecipeByIdError;
                }

                var res = new RecipeDto(recipeId, recipe.Title, recipe.Description,_mapper.Map<List<RecipeIngredientDto>> (recipe.Ingredients.ToList()), $"{recipe.Brewer.FirstName} {recipe.Brewer.LastName}", await GetRecipeCookingPrice(recipeId));
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetRecipeByIdAsync ERROR: {ex.Message}");
                return RecipeServiceErrors.GetRecipeByIdError;
            }
        }

        public async Task<Result<List<RecipeDto>, Error>> GetAllRecipesAsync()
        {
            try
            {
                var result = await GetFilteredRecipesAsync(_context.Recipes);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetRecipesAsync ERROR: {ex.Message}");
                return RecipeServiceErrors.GetRecipeListError;
            }
        }

        public async Task<Result<string, Error>> UpdateRecipeAsync(UpdateRecipeDto updateRecipeDto)
        {
            try
            {
                var isIdValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (isIdValid is false)
                {
                    return UserErrors.InvalidUserId;
                }

                var brewer = await _context
                    .Brewers
                    .FirstOrDefaultAsync(x => x.Id == userId);

                if (brewer is null)
                {
                    return ProfileServiceErrors.UserNotFoundError;
                }

                var userHasRoles = _contextAccessor.TryGetUserRole(out string userRole);

                if (!userHasRoles)
                {
                    return UserErrors.InvalidUserId;
                }


                var recipe = await _context.Recipes.Include(r => r.Ingredients).FirstOrDefaultAsync(r => r.Id == updateRecipeDto.Id);

                if (recipe is null)
                {
                    return RecipeServiceErrors.GetRecipeByIdError;
                }

                if (recipe.BrewerId != userId && userRole != "Administrator")
                {
                    return RecipeServiceErrors.NotYourRecipeError;
                }

                var ingredients = _mapper.Map<List<RecipeIngredient>>(updateRecipeDto.Ingredients.Select(i => new RecipeIngredient
                {
                    RecipeId = recipe.Id,
                    IngredientId = i.Id,
                    Weight = i.Weight
                }));

                _mapper.Map(updateRecipeDto, recipe);

                recipe.Ingredients = ingredients;


                await _context.SaveChangesAsync();

                return $"Successfully updated the \"{recipe.Title}\" recipe!";


            }


            catch (Exception ex)
            {
                _logger.LogError($"BLL.UpdateRecipeAsync ERROR: {ex.Message}");

                return RecipeServiceErrors.UpdateRecipeError;
            }
        }

        public async Task<Result<string, Error>> VoteRecipeAsync(Guid recipeId, string voteStatus)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var recipe = await _context.Recipes.Include(p => p.Votes).FirstOrDefaultAsync(p => p.Id == recipeId);

                if (recipe is null)
                {
                    return RecipeServiceErrors.GetRecipeByIdError;
                }

                if (recipe.BrewerId == userId)
                {
                    return RecipeServiceErrors.CannotVoteYourRecipeError;
                }

                var vote = await _context.Votes.FirstOrDefaultAsync(v => v.BrewerId == userId && v.RecipeId == recipeId);

                if (vote is null)
                {

                    switch (voteStatus)
                    {
                        case "UPVOTED":
                        case "DOWNVOTED":
                            vote = new RecipeVote
                            {
                                BrewerId = userId,
                                RecipeId = recipeId,
                                IsPositive = voteStatus == "UPVOTED"
                            };
                            await _context.Votes.AddAsync(vote);
                            recipe.Votes.Add(vote);
                            break;
                        case "UNVOTED":
                            return RecipeServiceErrors.RestractVoteError;

                        default:
                            return RecipeServiceErrors.WrongVoteInformation;
                    }
                }
                else
                {

                    switch (voteStatus)
                    {
                        case "UPVOTED":
                        case "DOWNVOTED":
                            vote.IsPositive = voteStatus == "UPVOTED";
                            break;

                        case "UNVOTED":
                            _context.Votes.Remove(vote);
                            break;

                        default:
                            return RecipeServiceErrors.WrongVoteInformation;
                    }
                }

                await _context.SaveChangesAsync();
                return "Voted this recipe successfully!";
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.VoteRecipeAsync ERROR: {ex.Message}");
                return RecipeServiceErrors.VoteRecipeError;
            }
        }

        private async Task<Result<List<RecipeDto>, Error>> GetFilteredRecipesAsync(IQueryable<Recipe> query)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);


                var recipes = await query.Include(r => r.Brewer).Include(r => r.Ingredients).ThenInclude(rI => rI.Ingredient).ToListAsync();
                var dtos = new List<RecipeDto>();
                
                await recipes.ForEachAsync(async recipe =>
                {
                    
                    dtos.Add(new RecipeDto(recipe.Id, recipe.Title, recipe.Description, _mapper.Map<IList<RecipeIngredientDto>>(recipe.Ingredients), $"{recipe.Brewer.FirstName} {recipe.Brewer.LastName}" ,await GetRecipeCookingPrice(recipe.Id)));
                });

                return dtos;

            }
            catch (Exception e)
            {
                throw new GetFilteredRecipesException(e.Message);
            }
        }

        private async Task<decimal> GetRecipeCookingPrice(Guid recipeId)
        {
            try
            {
                var recipe = await _context.Recipes.Include(r => r.Ingredients).ThenInclude(rI => rI.Ingredient).FirstOrDefaultAsync(r => r.Id == recipeId);

                var cookingPrice = 0M;
                await recipe.Ingredients.ToList().ForEachAsync(async ingredient =>
                {
                    cookingPrice += (decimal)ingredient.Weight * ingredient.Ingredient.Price;
                });
                return cookingPrice;

            }
            catch (Exception e)
            {
                throw new GetFilteredRecipesException(e.Message);
            }
        }

    }
}
