using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models.ErrorHandling;
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
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> roleManager;

        public Handler(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            this.roleManager = roleManager;
            _userManager = userManager;
        }

        public async Task<Unit> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            var user = new User()
                {
                    UserName = request.Login,
                    Email = request.Email
                };
            var result = await _userManager.CreateAsync(
                user, request.Password).ConfigureAwait(false);
            if (!result.Succeeded)
            {
                throw new ValidationErrorsException()
                {
                    Errors = result.Errors.Select(x => new HttpErrorInfo()
                    {
                    Key = x.Code,
                    Description = x.Description
                    })
                };
            }
            return Unit.Value;
        }
        }
    }
}