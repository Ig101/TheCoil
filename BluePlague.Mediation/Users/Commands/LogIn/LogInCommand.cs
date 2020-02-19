using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.LogIn
{
    public class LogInCommand : IRequest
    {
        public string Login { get; set; }

        public string Password { get; set; }

        private class Handler : IRequestHandler<LogInCommand>
        {
            private readonly SignInManager<User> _signInManager;

            public Handler(SignInManager<User> signInManager)
            {
                _signInManager = signInManager;
            }

            public async Task<Unit> Handle(LogInCommand request, CancellationToken cancellationToken)
            {
                var result = await _signInManager.PasswordSignInAsync(request.Login, request.Password, true, false);
                if (!result.Succeeded)
                {
                    throw new HttpException()
                    {
                        StatusCode = result.IsNotAllowed ? 403 : 401
                    };
                }

                return Unit.Value;
            }
        }
    }
}