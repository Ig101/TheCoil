using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Email;
using BluePlague.Domain.Identity;
using BluePlague.Infrastructure.Models.Email;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.SendPasswordChangeVerification
{
    public class SendPasswordChangeVerificationCommand : IRequest
    {
        public string Email { get; set; }

        private class Handler : IRequestHandler<SendPasswordChangeVerificationCommand>
        {
            private readonly IdentityUserManager _userManager;
            private readonly EmailSender _emailSender;

            public Handler(
                IdentityUserManager userManager,
                EmailSender emailSender)
            {
                _emailSender = emailSender;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(SendPasswordChangeVerificationCommand request, CancellationToken cancellationToken)
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
                                Description = $"User with email {request.Email} is not found."
                            }
                        }
                    };
                }

                var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                await _emailSender.SendAsync(new EmailMessage()
                {
                    ToAdresses = new[] { request.Email },
                    Subject = "Password change",
                    Body = $"Your token is {token}"
                });
                return Unit.Value;
            }
        }
    }
}