using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Email;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure.Models.Email;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BluePlague.Mediation.Users.Commands.SendEmailVerificationToken
{
    public class SendEmailVerificationTokenCommand : IRequest
    {
        public string Email { get; set; }

        private class Handler : IRequestHandler<SendEmailVerificationTokenCommand>
        {
            private readonly UserManager<User> _userManager;
            private readonly EmailSender _emailSender;

            public Handler(
                UserManager<User> userManager,
                EmailSender emailSender)
            {
                _emailSender = emailSender;
                _userManager = userManager;
            }

            public async Task<Unit> Handle(SendEmailVerificationTokenCommand request, CancellationToken cancellationToken)
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

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _emailSender.SendAsync(new EmailMessage()
                {
                    ToAdresses = new[] { request.Email },
                    Subject = "Email verification required",
                    Body = $"Your token is {token}"
                });
                return Unit.Value;
            }
        }
    }
}