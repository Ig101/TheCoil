using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Email;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models.Email;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.SendEmailVerification
{
    public class SendEmailVerificationByEmailCommand : IRequest
    {
        public string Email { get; set; }

        private class Handler : IRequestHandler<SendEmailVerificationByEmailCommand>
        {
            private readonly UserManager<User> _userManager;
            private readonly IMediator _mediator;

            public Handler(
                UserManager<User> userManager,
                IMediator mediator)
            {
                _mediator = mediator;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(SendEmailVerificationByEmailCommand request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);
                if (user == null)
                {
                    throw new ValidationErrorsException()
                    {
                        Errors = new[]
                        {
                            new HttpErrorInfo()
                            {
                                Key = "email",
                                Description = "User with 'Email' is not found."
                            }
                        }
                    };
                }

                await _mediator.Send(new SendEmailVerificationCommand()
                {
                    User = user
                });
                return Unit.Value;
            }
        }
    }
}