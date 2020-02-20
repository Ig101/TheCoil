using System;
using FluentValidation;

namespace BluePlague.Mediation.Users.Commands.SendEmailVerificationToken
{
  public class SendEmailVerificationTokenCommandValidator : AbstractValidator<SendEmailVerificationTokenCommand>
  {
    public SendEmailVerificationTokenCommandValidator()
    {
      RuleFor(x => x.Email).NotEmpty();
    }
  }
}