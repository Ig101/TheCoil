using System.Threading;
using System.Threading.Tasks;
using BluePlague.Domain.Email;
using BluePlague.Domain.Identity;
using BluePlague.Domain.Identity.Entities;
using BluePlague.Infrastructure;
using BluePlague.Infrastructure.Models.Email;
using BluePlague.Infrastructure.Models.ErrorHandling;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BluePlague.Mediation.Users.Commands.SendEmailVerification
{
    internal class SendEmailVerificationCommand : IRequest
    {
        public User User { get; set; }

        private class Handler : IRequestHandler<SendEmailVerificationCommand>
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

            public async Task<Unit> Handle(SendEmailVerificationCommand request, CancellationToken cancellationToken)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(request.User);
                await _emailSender.SendAsync(new EmailMessage()
                {
                    ToAdresses = new[] { request.User.Email },
                    Subject = "Email verification required",
                    Body = $"<p>Hello!</p><p>To confirm your account in Blue Plague follow the link https://{_serverSettings.Site}/lobby/signup/confirmation/{request.User.Id}/{token}.</p><p>If you didn't request this message, just ignore it.</p>"
                });
                return Unit.Value;
            }
        }
    }
}