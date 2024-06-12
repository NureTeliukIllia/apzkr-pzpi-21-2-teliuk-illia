using BLL.BrewingManagement;
using BLL.IdentityManagement;
using BLL.IdentityManagement.Interfaces;
using Infrustructure.Dto.Account;
using Infrustructure.Dto.Equipment;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace heisenbrew_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BrewingController : ControllerBase
    {
        private readonly IBrewingService _brewingService;

        public BrewingController(IBrewingService brewingService)
        {
            _brewingService = brewingService;

        }

        /// <summary>
        /// Aborts an equipment's current brewing status.
        /// </summary>
        /// <param name="equipmentId">The id of the equipment to abort its current brewing status.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("abort/{equipmentId}")]
        public async Task<IActionResult> AbortBrewing(Guid equipmentId)
        {
            var result = await _brewingService.AbortBrewingAsync(equipmentId);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets an a list of equipment's brewings.
        /// </summary>
        /// <param name="equipmentId">The id of the equipment to get its list of brewings.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("equipment-brewings/{equipmentId}")]
        public async Task<IActionResult> StartBrewing(Guid equipmentId)
        {
            var result = await _brewingService.GetBrewingsAsync(equipmentId);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets an equipment's current brewing status.
        /// </summary>
        /// <param name="equipmentId">The id of the equipment to get its current brewing status.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("brewing-status/{equipmentId}")]
        public async Task<IActionResult> GetBrewingStatus(Guid equipmentId)
        {
            var result = await _brewingService.GetBrewingStatusAsync(equipmentId);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Starts brewing on the equipment.
        /// </summary>
        /// <param name="recipeId">The id of the recipe to be brewed.</param>
        /// <param name="equipmentId">The id of the equipment to brew on.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("start")]
        public async Task<IActionResult> StartBrewing([FromQuery] Guid recipeId, Guid equipmentId)
        {
            var result = await _brewingService.StartBrewingAsync(recipeId, equipmentId);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Update equipment's connection string.
        /// </summary>
        /// <param name="equipmentSettingsDto">The dto with info about equipment settings.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpPut("my-equipment/update-string")]
        public async Task<IActionResult> UpdateConnectionString([FromBody] EquipmentSettingsDto equipmentSettingsDto)
        {
            var result = await _brewingService.UpdateConnectionStringAsync(equipmentSettingsDto);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets an equipment's status.
        /// </summary>
        /// <param name="equipmentId">The id of the equipment to get its status.</param>
        /// <remarks>
        /// If the operation is successful, it will return a corresponding message.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("equipment-status/{equipmentId}")]
        public async Task<IActionResult> GetEquipmentStatus(Guid equipmentId)
        {
            var result = await _brewingService.GetEquipmentStatusAsync(equipmentId);
            return this.CreateResponse(result);
        }

        /// <summary>
        /// Gets an equipment's availability status.
        /// </summary>
        /// <param name="equipmentId">The id of the equipment to get its availability status.</param>
        /// <remarks>
        /// If the operation is successful, it will return a boolean value.
        /// </remarks>
        /// <returns>An IActionResult representing the result of the operation.</returns>
        [Authorize]
        [HttpGet("equipment-availability/{equipmentId}")]
        public async Task<IActionResult> GetEquipmentAvailability(Guid equipmentId)
        {
            var result = await _brewingService.GetEquipmentAvailabilityAsync(equipmentId);
            return this.CreateResponse(result);
        }
    }
}
