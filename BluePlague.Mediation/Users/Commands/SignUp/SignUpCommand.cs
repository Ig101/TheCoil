using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.SignUp
{
    public class SignUpCommand : IRequest
    {
        public string Name { get; set; }

        public string Email { get; set; }

        public string Password { get; set; }

        private class Handler : IRequestHandler<SignUpCommand>
        {
        private readonly UserManager<User> _userManager;

        public Handler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<Unit> Handle(SignUpCommand request, CancellationToken cancellationToken)
        {
            var user = new User()
                {
                    UserName = Guid.NewGuid().ToString(),
                    Email = request.Email,
                    ViewName = request.Name
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