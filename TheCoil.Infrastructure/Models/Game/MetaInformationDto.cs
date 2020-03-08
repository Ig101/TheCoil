using System;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Infrastructure.Models.Game
{
    public class MetaInformationDto
    {
        public Guid GameId { get; set; }

        public int Height { get; set; }

        public int Width { get; set; }

        public string Session { get; set; }

        public int Incrementor { get; set; }

        public int Turn { get; set; }

        public GameState GameState { get; set; }
    }
}