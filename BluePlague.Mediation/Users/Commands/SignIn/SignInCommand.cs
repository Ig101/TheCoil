using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Identity;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.SignIn
{
  public class SignInCommand : IRequest
  {
    public string Email { get; set; }

    public string Password { get; set; }

    private class Handler : IRequestHandler<SignInCommand>
    {
      private readonly SignInManager<User> _signInManager;
      private readonly IdentityUserManager _userManager;

      public Handler(
          SignInManager<User> signInManager,
          IdentityUserManager userManager)
      {
        _userManager = userManager;
        _signInManager = signInManager;
      }

      public async Task<Unit> Handle(SignInCommand request, CancellationToken cancellationToken)
      {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
          throw new HttpException()
          {
            StatusCode = 401
          };
        }

        if (!user.EmailConfirmed)
        {
          throw new ValidationErrorsException()
          {
            Errors = new[]
            {
              new HttpErrorInfo()
              {
                Key = "email",
                Description = "'Email' is not verified."
              }
            }
          };
        }

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, true, false);
        if (!result.Succeeded)
        {
          throw new HttpException()
          {
            StatusCode = 403
          };
        }

        return Unit.Value;
      }
    }
  }
}