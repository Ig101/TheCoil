using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.Register
{
    public class RegisterCommand : IRequest
    {
        public string Login { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        private class Handler : IRequestHandler<RegisterCommand>
        {
            private readonly UserManager<IdentityUser> _userManager;

            public Handler(UserManager<IdentityUser> userManager)
            {
                _userManager = userManager;
            }

            public async Task<Unit> Handle(RegisterCommand request, CancellationToken cancellationToken)
            {
                var result = await _userManager.CreateAsync(
                    new IdentityUser()
                    {
                    UserName = request.Login,
                    Email = request.Email
                    }, request.Password).ConfigureAwait(false);
                if (!result.Succeeded)
                {
                    // TODO Exception
                }

                return Unit.Value;
            }
        }
    }
}