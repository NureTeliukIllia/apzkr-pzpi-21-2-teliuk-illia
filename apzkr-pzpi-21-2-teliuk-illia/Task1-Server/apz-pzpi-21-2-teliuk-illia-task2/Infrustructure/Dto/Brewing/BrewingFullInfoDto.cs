using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrustructure.Dto.Brewing
{
    public record BrewingFullInfoDto
    (
        Guid Id,
        Guid RecipeId,
        string EquipmentTitle,
        string RecipeTitle,
        string BrewingStatus,
        string LastUpdateDate,
        IList<BrewingLogDto> BrewingLogs,
        string CreatedAt
    );
}
