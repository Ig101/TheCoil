using FluentValidation;

namespace TheCoil.Mediation.Game.Commands.CreateNewGame
{
    public class CreateNewGameCommandValidator : AbstractValidator<CreateNewGameCommand>
    {
        public CreateNewGameCommandValidator()
        {
            RuleFor(x => x.PlayerName).NotEmpty();
            RuleFor(x => x.PlayerName).MinimumLength(3);
            RuleFor(x => x.PlayerName).MaximumLength(40);
        }
    }
}