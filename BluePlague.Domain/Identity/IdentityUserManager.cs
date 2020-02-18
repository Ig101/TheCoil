using System;
using System.Collections.Generic;
using BluePlague.Domain.Identity.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace BluePlague.Domain.Identity
{
  public class IdentityUserManager : UserManager<User>
  {
    public IdentityUserManager(
        IUserStore<User> store,
        IOptions<IdentityOptions> optionsAccessor,
        IPasswordHasher<User> passwordHasher,
        IEnumerable<IUserValidator<User>> userValidators,
        IEnumerable<IPasswordValidator<User>> passwordValidators,
        ILookupNormalizer keyNormalizer,
        IdentityErrorDescriber errors,
        IServiceProvider services,
        ILogger<UserManager<User>> logger)
        : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
    {
    }
  }
}