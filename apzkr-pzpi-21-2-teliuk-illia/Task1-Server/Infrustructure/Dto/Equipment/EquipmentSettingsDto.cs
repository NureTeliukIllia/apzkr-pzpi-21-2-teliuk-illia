using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrustructure.Dto.Equipment
{
    public record EquipmentSettingsDto
    (
        Guid EquipmentId,
        string ConnectionString
    );
}
