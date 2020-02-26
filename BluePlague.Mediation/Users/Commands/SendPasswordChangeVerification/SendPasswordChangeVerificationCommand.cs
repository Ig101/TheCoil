using System.Threading;
using System.Threading.Tasks;
using System.Web;
using BluePlague.Domain.Email;
using BluePlague.Domain.Identity;
using BluePlague.Infrastructure;
using BluePlague.Infrastructure.Models.Email;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BluePlague.Mediation.Users.Commands.SendPasswordChangeVerification
{
    public class SendPasswordChangeVerificationCommand : IRequest
    {
        public string Email { get; set; }

        private class Handler : IRequestHandler<SendPasswordChangeVerificationCommand>
        {
            private readonly IdentityUserManager _userManager;
            private readonly EmailSender _emailSender;
            private readonly ServerSettings _serverSettings;

            public Handler(
                IdentityUserManager userManager,
                EmailSender emailSender,
                IOptions<ServerSettings> serverSettings)
            {
                _emailSender = emailSender;
                _serverSettings = serverSettings.Value;
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
                    Subject = "Change password request",
                    Body = $"<p>Hello!</p><p>If you want to change you password in Blue Plague, follow the link <a href=\"{_serverSettings.Site}/lobby/signin/new-password/{user.Id}/{HttpUtility.UrlEncode(token)}\">link</a>.</p><p>If you didn't request this message, just ignore it.</p>"
                });
                return Unit.Value;
            }
        }
    }
}