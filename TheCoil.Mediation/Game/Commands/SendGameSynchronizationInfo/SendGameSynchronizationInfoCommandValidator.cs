using System.Data;
using FluentValidation;

namespace TheCoil.Mediation.Game.Commands.SendGameSynchronizationInfo
{
    public class SendGameSynchronizationInfoCommandValidator : AbstractValidator<SendGameSynchronizationInfoCommand>
    {
        public SendGameSynchronizationInfoCommandValidator()
        {
            RuleFor(x => x.MetaInformation).ChildRules(child =>
            {
                child.RuleFor(x => x.GameId).NotNull();
                child.RuleFor(x => x.GameState).NotNull();
                child.RuleFor(x => x.Incrementor).NotNull();
                child.RuleFor(x => x.Session).NotNull();
                child.RuleFor(x => x.Turn).NotNull();
            });
            RuleFor(x => x.Player).ChildRules(child =>
            {
                child.RuleFor(x => x.Scene).NotNull();
                child.RuleFor(x => x.Actor).NotNull();
            });
            RuleForEach(x => x.SceneSegments).ChildRules(child =>
            {
                child.RuleFor(x => x.Actors).NotNull();
                child.RuleFor(x => x.Tiles).NotNull();
                child.RuleFor(x => x.Difficulty).NotNull();
                child.RuleFor(x => x.LastSaveTurn).NotNull();
                child.RuleFor(x => x.Id).NotNull();
            });
        }
    }
}