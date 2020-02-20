using FluentValidation;

namespace BluePlague.Mediation.Users.Commands.SignUp
{
  public class SignUpCommandValidator : AbstractValidator<SignUpCommand>
  {
    public SignUpCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty();
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.Password).NotEmpty();
    }
  }
}