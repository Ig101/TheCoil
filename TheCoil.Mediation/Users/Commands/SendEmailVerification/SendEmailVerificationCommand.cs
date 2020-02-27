using System.Threading;
using System.Threading.Tasks;
using System.Web;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TheCoil.Domain.Email;
using TheCoil.Domain.Identity;
using TheCoil.Domain.Identity.Entities;
using TheCoil.Infrastructure;
using TheCoil.Infrastructure.Models.Email;
using TheCoil.Infrastructure.Models.ErrorHandling;

namespace TheCoil.Mediation.Users.Commands.SendEmailVerification
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
                    Body = $"<p>Hello!</p><p>To confirm your account in Blue Plague follow the <a href=\"{_serverSettings.Site}/lobby/signup/confirmation/{request.User.Id}/{HttpUtility.UrlEncode(token)}\">link</a>.</p><p>If you didn't request this message, just ignore it.</p>"
                });
                return Unit.Value;
            }
        }
    }
}