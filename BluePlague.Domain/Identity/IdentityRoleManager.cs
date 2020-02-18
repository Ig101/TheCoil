using System.Collections.Generic;
using BluePlague.Domain.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace BluePlague.Domain.Identity
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