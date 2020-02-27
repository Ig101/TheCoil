using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using TheCoil.Domain.Identity.Entities;

namespace TheCoil.Domain.Identity
{
  public class IdentityRoleManager : RoleManager<Role>
  {
    public IdentityRoleManager(
        IRoleStore<Role> store,
        IEnumerable<IRoleValidator<Role>> roleValidators,
        ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors,
        ILogger<RoleManager<Role>> logger)
        : base(store, roleValidators, keyNormalizer, errors, logger)
    {
    }
  }
}