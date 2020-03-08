using System;

namespace TheCoil.Infrastructure.Models.Game
{
    public class GameStatusDto
    {
        public Guid GameId { get; set; }

        public string PlayerName { get; set; }
    }
}