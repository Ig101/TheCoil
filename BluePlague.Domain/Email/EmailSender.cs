using System.Linq;
using System.Threading.Tasks;
using BluePlague.Infrastructure.Models.Email;
using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;

namespace BluePlague.Domain.Email
{
    public class EmailSender
    {
        private readonly EmailSenderSettings _settings;

        public EmailSender(IOptions<EmailSenderSettings> settings)
        {
            _settings = settings.Value;
        }

        public async Task SendAsync(EmailMessage message)
        {
            var mimeMessage = new MimeMessage();
            mimeMessage.To.AddRange(message.ToAdresses
                .Select(x => new MailboxAddress(x)));
            mimeMessage.From.Add(new MailboxAddress(_settings.FromName, _settings.FromAdress));
            mimeMessage.Subject = message.Subject;
            mimeMessage.Body = new TextPart(TextFormat.Html)
            {
                Text = message.Body
            };
            using var emailClient = new SmtpClient();
            await emailClient.ConnectAsync(_settings.SmtpHost, _settings.SmtpPort, true);
            emailClient.AuthenticationMechanisms.Remove("XOAUTH2");
            emailClient.Authenticate(_settings.SmtpLogin, _settings.SmtpPassword);
            emailClient.Send(mimeMessage);
            emailClient.Disconnect(true);
        }
    }
}