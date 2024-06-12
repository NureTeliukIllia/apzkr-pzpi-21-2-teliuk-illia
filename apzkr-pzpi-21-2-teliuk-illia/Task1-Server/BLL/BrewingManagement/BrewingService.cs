using AutoMapper;
using BLL.BrewingManagement;
using Core;
using Core.Models;
using Core.Models.Equipment;
using DAL;
using Infrustructure.Dto.Brewing;
using Infrustructure.Dto.Equipment;
using Infrustructure.Dto.Ingredient;
using Infrustructure.Dto.Recipe;
using Infrustructure.ErrorHandling.Errors.Base;
using Infrustructure.ErrorHandling.Errors.ServiceErrors;
using Infrustructure.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.BrewingManagement
{
    public class BrewingService : IBrewingService
    {
        private readonly ILogger<BrewingService> _logger;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _contextAccessor;

        public BrewingService(ILogger<BrewingService> logger, IMapper mapper, ApplicationDbContext context, IHttpContextAccessor contextAccessor)
        {
            _logger = logger;
            _mapper = mapper;
            _context = context;
            _contextAccessor = contextAccessor;
        }
        public async Task<Result<string, Error>> AbortBrewingAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).Include(bBE => bBE.Brewings).ThenInclude(b => b.BrewingLogs).FirstOrDefaultAsync();



                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var isReachable = await IsConnectionStringReachableAsync(equipment.ConnectionString);
                if (!isReachable)
                {
                    return BrewingEquipmentServiceErrors.EquipmentIsNotReachableError;
                }

                if (!equipment.IsBrewing)
                {
                    return BrewingServiceErrors.NoBrewingsNowError;
                }


                await AbortBrewingAsync(equipment.ConnectionString);
                await GetBrewingStatusAsync(equipmentId);


                return $"Successfully stopped the brewing on {equipment.BrewingEquipment.Name}.";

            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.AbortBrewingAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.AbortBrewingError;
            }
        }

        public async Task<Result<BrewingFullInfoDto, Error>> GetBrewingStatusAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var user = await _context.Brewers.Include(u => u.Ingredients).FirstOrDefaultAsync(u => u.Id == userId);
                var equipment = await _context.BrewerBrewingEquipment.Include(bE => bE.BrewingEquipment).Include(bE => bE.Brewings).FirstOrDefaultAsync(bE => bE.Id == equipmentId);

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var isReachable = await IsConnectionStringReachableAsync(equipment.ConnectionString);
                if (!isReachable)
                {
                    return BrewingEquipmentServiceErrors.EquipmentIsNotReachableError;
                }

                var brewingHistoryCount = await GetBrewingHistoryCountAsync(equipment.ConnectionString);

                if (brewingHistoryCount == 0)
                {
                    return BrewingServiceErrors.NoBrewingsError;
                }

                var currentBrewingStatus = await GetBrewingStatusAsync(equipment.ConnectionString);
                var brewingExists = await _context.Brewings.AnyAsync(b => b.Id == currentBrewingStatus.Id);
                var brewing = new Brewing();
                if (brewingExists)
                {
                    brewing = await _context.Brewings.Where(b => b.Id == currentBrewingStatus.Id).Include(b => b.BrewingLogs).Include(b => b.Recipe).Include(b => b.BrewerBrewingEquipment).ThenInclude(bE => bE.BrewingEquipment).FirstOrDefaultAsync();

                }
                else
                {
                    brewing.Id = currentBrewingStatus.Id;
                    brewing.RecipeId = currentBrewingStatus.RecipeId;
                    brewing.BrewerBrewingEquipmentId = equipmentId;
                    brewing.CreatedAt = DateTime.Parse(currentBrewingStatus.CreatedAt);
                    equipment.Brewings.Add(brewing);
                }
                Enum.TryParse(currentBrewingStatus.BrewingStatus, true, out Status parsedStatus);
                brewing.Status = parsedStatus;


                var brewLogs = new List<BrewingLog>();
                foreach (var item in currentBrewingStatus.BrewingLogs)
                {
                    var isParsed = Enum.TryParse(item.StatusCode, true, out BrewingLogCode parsedLogCode);
                    brewLogs.Add(new BrewingLog
                    {
                        BrewingId = brewing.Id,
                        StatusCode = parsedLogCode,
                        Message = item.Message,
                        LogTime = DateTime.Parse(item.LogTime)

                    });
                }
                brewing.BrewingLogs = brewLogs;
                if (brewing.Status == Status.Aborted || brewing.Status == Status.Failed || brewing.Status == Status.Finished)
                {
                    equipment.IsBrewing = false;
                }
                await _context.SaveChangesAsync();
                return new BrewingFullInfoDto
                (
                    brewing.Id,
                    brewing.RecipeId,
                    brewing.BrewerBrewingEquipment.BrewingEquipment.Name,
                    brewing.Recipe.Title,
                    Enum.GetName(typeof(Status), brewing.Status),
                    currentBrewingStatus.LastUpdateDate,
                    _mapper.Map<IList<BrewingLogDto>>(brewing.BrewingLogs),
                    currentBrewingStatus.CreatedAt
                );
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetBrewingStatusAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.GetBrewingStatusError;
            }
        }


        public async Task<Result<List<BrewingShortInfoDto>, Error>> GetBrewingsAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).Include(bBE => bBE.Brewings).ThenInclude(b => b.BrewingLogs).FirstOrDefaultAsync();

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                await GetBrewingStatusAsync(equipmentId);

                var brewings = await _context.Brewings.Where(b => b.BrewerBrewingEquipmentId == equipmentId).OrderByDescending(b => b.CreatedAt).Include(b => b.BrewingLogs).Include(b => b.Recipe).Include(b => b.BrewerBrewingEquipment).ThenInclude(bE => bE.BrewingEquipment).ToListAsync();



                return brewings.Select(brewing => new BrewingShortInfoDto
                (
                    brewing.BrewerBrewingEquipment.BrewingEquipment.Name,
                    brewing.Recipe.Title,
                    Enum.GetName(typeof(Status), brewing.Status),
                    brewing.BrewingLogs.Select(b => b.LogTime).LastOrDefault().ToString("yyyy'-'MM'-'dd'T'HH':'mm':'ss")
                )).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetBrewingsAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.GetBrewingListError;
            }
        }

        public async Task<Result<string, Error>> StartBrewingAsync(Guid recipeId, Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var user = await _context.Brewers.Include(u => u.Ingredients).FirstOrDefaultAsync(u => u.Id == userId);
                var equipment = await _context.BrewerBrewingEquipment.Include(bE => bE.BrewingEquipment).FirstOrDefaultAsync(bE => bE.Id == equipmentId);

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var isReachable = await IsConnectionStringReachableAsync(equipment.ConnectionString);
                if (!isReachable)
                {
                    return BrewingEquipmentServiceErrors.EquipmentIsNotReachableError;
                }

                if (equipment.IsBrewing)
                {
                    return BrewingServiceErrors.EquipmentIsBusyError;
                }

                var recipe = await _context.Recipes.Include(r => r.Ingredients).ThenInclude(i => i.Ingredient).FirstOrDefaultAsync(r => r.Id == recipeId);


                foreach (var ingredient in recipe.Ingredients)
                {
                    if (!user.Ingredients.Select(i => i.IngredientId).ToList().Contains(ingredient.IngredientId))
                    {
                        return BrewingServiceErrors.DontHaveIngredientError(ingredient.Ingredient.Name);
                    }

                    var usersIngredient = user.Ingredients.FirstOrDefault(i => i.IngredientId == ingredient.IngredientId);

                    if (usersIngredient.Weight < ingredient.Weight)
                    {
                        return BrewingServiceErrors.DontHaveEnoughIngredientError(ingredient.Ingredient.Name);
                    }

                    usersIngredient.Weight -= ingredient.Weight;
                }
                var recipeJson = JsonConvert.SerializeObject(new RecipeShortInfoDto(recipe.Id, recipe.Title, recipe.Description, _mapper.Map<IList<RecipeIngredientDto>>(recipe.Ingredients)), Formatting.Indented,
                    new JsonSerializerSettings
                    {
                        PreserveReferencesHandling = PreserveReferencesHandling.Objects
                    }
                );
                var equipmentStatus = await StartBrewingOnIoTDeviceAsync(equipment.ConnectionString, new StringContent(recipeJson));
                var brewingStatus = Enum.TryParse(equipmentStatus.BrewingStatus, out Status status);
                var brewing = new Brewing { Id = equipmentStatus.Id, BrewerBrewingEquipmentId = equipmentId, RecipeId = recipeId, Status = status, BrewingLogs = _mapper.Map<ICollection<BrewingLog>>(equipmentStatus.BrewingLogs), CreatedAt = DateTime.Now };
                brewing.BrewingLogs.Add(new BrewingLog { Brewing = brewing, StatusCode = BrewingLogCode.Info, Message = "Starting the brewing process", LogTime = DateTime.Now });

                await _context.Brewings.AddAsync(brewing);
                equipment.IsBrewing = true;
                await _context.SaveChangesAsync();
                return $"Successfully started brewing the \"{recipe.Title}\" on your \"{equipment.BrewingEquipment.Name}\"!";
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.StartBrewingAsync ERROR: {ex.Message}");
                return BrewingServiceErrors.CreateBrewingError;
            }
        }
        private async Task<BrewingFullInfoDto> StartBrewingOnIoTDeviceAsync(string connectionString, HttpContent recipe)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.PostAsync($"{connectionString}startbrewing", recipe);
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var status = JsonConvert.DeserializeObject<BrewingFullInfoDto>(content);
                    return status;
                }
                else
                {
                    throw new Exception($"Failed to start brewing on the IoT device. Status code: {response.StatusCode}");
                }
            }
        }

        private async Task<BrewingFullInfoDto> GetBrewingStatusAsync(string connectionString)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync($"{connectionString}brewingstatus");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var status = JsonConvert.DeserializeObject<BrewingFullInfoDto>(content);
                    return status;
                }
                else
                {
                    throw new Exception($"Failed to get brewing status. Status code: {response.StatusCode}");
                }
            }
        }

        private async Task<int> GetBrewingHistoryCountAsync(string connectionString)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync($"{connectionString}history-count");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var status = JsonConvert.DeserializeObject<int>(content);
                    return status;
                }
                else
                {
                    throw new Exception($"Failed to get brewing history count. Status code: {response.StatusCode}");
                }
            }
        }

        private async Task AbortBrewingAsync(string connectionString)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync($"{connectionString}abort");
                if (response.IsSuccessStatusCode)
                {
                    return;
                }
                else
                {
                    throw new Exception($"Failed to get brewing history count. Status code: {response.StatusCode}");
                }
            }
        }

        private async Task<bool> IsConnectionStringReachableAsync(string connectionString)
        {
            if (!(await IsValidURI(connectionString))) return false;

            using (var httpClient = new HttpClient())
            {
                try
                {
                    var response = await httpClient.GetAsync($"{connectionString}is-reachable");
                    if (response.IsSuccessStatusCode)
                    {
                        return true;
                    }

                    return false;

                }
                catch (HttpRequestException)
                {
                    return false;
                }
            }
        }

        public async Task<Result<BrewerBrewingEquipmentFullInfoDto, Error>> UpdateConnectionStringAsync(EquipmentSettingsDto equipmentSettingsDto)
        {

            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentSettingsDto.EquipmentId).Include(bBE => bBE.BrewingEquipment).FirstOrDefaultAsync();

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var isReachable = await IsConnectionStringReachableAsync(equipmentSettingsDto.ConnectionString);
                if (!isReachable)
                {
                    return BrewingEquipmentServiceErrors.EquipmentIsNotReachableError;
                }

                equipment.ConnectionString = equipmentSettingsDto.ConnectionString;
                _context.BrewerBrewingEquipment.Update(equipment);
                await _context.SaveChangesAsync();
                return _mapper.Map<BrewerBrewingEquipmentFullInfoDto>(equipment);

            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.UpdateConnectionStringAsync ERROR: {ex.Message}");
                return BrewingEquipmentServiceErrors.ChangeConnectionStringError;
            }

        }

        public async Task<Result<EquipmentStatusDto, Error>> GetEquipmentStatusAsync(Guid equipmentId)
        {
            try
            {
                var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

                if (!isUserValid)
                {
                    return UserErrors.InvalidUserId;
                }

                var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).FirstOrDefaultAsync();

                if (equipment is null)
                {
                    return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
                }

                if (equipment.BrewerId != userId)
                {
                    return BrewingEquipmentServiceErrors.NotYourEquipmentError;
                }

                var isReachable = await IsConnectionStringReachableAsync(equipment.ConnectionString);
                if (!isReachable)
                {
                    return BrewingEquipmentServiceErrors.EquipmentIsNotReachableError;
                }

                var connectionString = equipment.ConnectionString;
                var status = await FetchStatusFromIoTDeviceAsync(connectionString);

                equipment.IsBrewing = status.IsBrewing;
                await _context.SaveChangesAsync();

                var response = new EquipmentStatusDto(status.Temperature, status.Pressure, status.Humidity, status.Fullness, status.LastUpdate, status.IsBrewing);
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"BLL.GetEquipmentStatusAsync ERROR: {ex.Message}");
                return BrewingEquipmentServiceErrors.GetEquipmentStatusError;
            }
        }
        private async Task<EquipmentStatusDto> FetchStatusFromIoTDeviceAsync(string connectionString)
        {
            using (var httpClient = new HttpClient())
            {
                var response = await httpClient.GetAsync($"{connectionString}status");
                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    var status = JsonConvert.DeserializeObject<EquipmentStatusDto>(content);
                    return status;
                }
                else
                {
                    throw new Exception($"Failed to fetch status from IoT device. Status code: {response.StatusCode}");
                }
            }
        }

        public async Task<Result<bool, Error>> GetEquipmentAvailabilityAsync(Guid equipmentId)
        {
            var isUserValid = _contextAccessor.TryGetUserId(out Guid userId);

            if (!isUserValid)
            {
                return UserErrors.InvalidUserId;
            }

            var equipment = await _context.BrewerBrewingEquipment.Where(bE => bE.Id == equipmentId).Include(bBE => bBE.BrewingEquipment).FirstOrDefaultAsync();

            if (equipment is null)
            {
                return BrewingEquipmentServiceErrors.GetEquipmentByIdError;
            }

            if (equipment.BrewerId != userId)
            {
                return BrewingEquipmentServiceErrors.NotYourEquipmentError;
            }

            var isReachable = await IsConnectionStringReachableAsync(equipment.ConnectionString);

            return isReachable;
        }
        private async Task<bool> IsValidURI(string uri)
        {
            if (!Uri.IsWellFormedUriString(uri, UriKind.Absolute))
                return false;
            Uri tmp;
            if (!Uri.TryCreate(uri, UriKind.Absolute, out tmp))
                return false;
            return tmp.Scheme == Uri.UriSchemeHttp || tmp.Scheme == Uri.UriSchemeHttps;
        }
    }
}
