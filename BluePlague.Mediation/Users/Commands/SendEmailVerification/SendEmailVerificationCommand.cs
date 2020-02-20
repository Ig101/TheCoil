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
    internal class SendEmailVerificationCommand : IRequest
    {
        public User User { get; set; }

        private class Handler : IRequestHandler<SendEmailVerificationCommand>
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

            public async Task<Unit> Handle(SendEmailVerificationCommand request, CancellationToken cancellationToken)
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(request.User);
                await _emailSender.SendAsync(new EmailMessage()
                {
                    ToAdresses = new[] { request.User.Email },
                    Subject = "Email verification required",
                    Body = $"Your token is {token}"
                });
                return Unit.Value;
            }
        }
    }
}