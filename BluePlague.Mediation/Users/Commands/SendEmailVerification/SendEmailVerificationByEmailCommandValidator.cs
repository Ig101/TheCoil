using System;
using FluentValidation;

namespace BluePlague.Mediation.Users.Commands.SendEmailVerification
{
  public class SendEmailVerificationByEmailCommandValidator : AbstractValidator<SendEmailVerificationByEmailCommand>
  {
    public SendEmailVerificationByEmailCommandValidator()
    {
      RuleFor(x => x.Email).NotEmpty();
    }
  }
}