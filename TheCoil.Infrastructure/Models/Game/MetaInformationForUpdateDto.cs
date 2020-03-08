using System;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Infrastructure.Models.Game
{
    public class MetaInformationForUpdateDto
    {
        public int Incrementor { get; set; }

        public int Turn { get; set; }

        public GameState GameState { get; set; }
    }
}