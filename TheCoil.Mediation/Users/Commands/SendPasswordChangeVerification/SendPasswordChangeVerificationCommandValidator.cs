using System;
using FluentValidation;

namespace TheCoil.Mediation.Users.Commands.SendPasswordChangeVerification
{
  public class SendPasswordChangeVerificationCommandValidator : AbstractValidator<SendPasswordChangeVerificationCommand>
  {
    public SendPasswordChangeVerificationCommandValidator()
    {
      RuleFor(x => x.Email).NotEmpty();
    }
  }
}