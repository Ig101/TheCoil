using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TheCoil.Domain.Identity;
using TheCoil.Domain.Identity.Entities;
using TheCoil.Infrastructure.Models.ErrorHandling;

namespace TheCoil.Mediation.Users.Commands.SignIn
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
            StatusCode = 401,
            Error = "Wrong email or password."
          };
        }

        if (!user.EmailConfirmed)
        {
          throw new HttpException()
          {
            StatusCode = 403,
            Error = "email"
          };
        }

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, true, false);
        if (!result.Succeeded)
        {
          throw new HttpException()
          {
            StatusCode = 401,
            Error = "Wrong email or password."
          };
        }

        return Unit.Value;
      }
    }
  }
}