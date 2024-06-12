using Infrustructure.Dto.Equipment;
using Infrustructure.Dto.Ingredient;
using Infrustructure.Dto.Recipe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrustructure.Dto.UserProfile
{
    public record BrewerProfileDto
    (
        Guid Id,
        string FullName
    );
}
