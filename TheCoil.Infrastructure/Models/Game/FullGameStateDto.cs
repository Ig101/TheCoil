namespace TheCoil.Infrastructure.Models.Game
{
    public class FullGameStateDto : GameStateDto
    {
        public PlayerDto Player { get; set; }

        public MetaInformationDto MetaInformation { get; set; }
    }
}