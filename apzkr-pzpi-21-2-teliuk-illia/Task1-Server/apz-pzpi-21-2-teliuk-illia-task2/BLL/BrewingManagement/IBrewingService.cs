using Core;
using Infrustructure.Dto.Brewing;
using Infrustructure.Dto.Equipment;
using Infrustructure.ErrorHandling.Errors.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.BrewingManagement
{
    public interface IBrewingService
    {
        public Task<Result<string, Error>> StartBrewingAsync(Guid recipeId, Guid equipmentId);
        public Task<Result<BrewingFullInfoDto, Error>> GetBrewingStatusAsync(Guid equipmentId);
        public Task<Result<string, Error>> AbortBrewingAsync(Guid equipmentId);
        public Task<Result<List<BrewingShortInfoDto>, Error>> GetBrewingsAsync(Guid equipmentId);
        public Task<Result<BrewerBrewingEquipmentFullInfoDto, Error>> UpdateConnectionStringAsync(EquipmentSettingsDto equipmentSettingsDto);
        public Task<Result<EquipmentStatusDto, Error>> GetEquipmentStatusAsync(Guid equipmentId);
        public Task<Result<bool, Error>> GetEquipmentAvailabilityAsync(Guid equipmentId);

    }
}
