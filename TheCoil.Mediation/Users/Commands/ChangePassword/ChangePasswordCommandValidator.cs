using FluentValidation;

namespace TheCoil.Mediation.Users.Commands.ChangePassword
{
  public class ChangePasswordCommandValidator : AbstractValidator<ChangePasswordCommand>
  {
    public ChangePasswordCommandValidator()
    {
        RuleFor(x => x.UserId).NotEmpty();
        RuleFor(x => x.Code).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
  }
}