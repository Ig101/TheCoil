namespace TheCoil.Infrastructure.Models.Game
{
    public class ActorDto
    {
        public int Id { get; set; }

        public int X { get; set; }

        public int Y { get; set; }

        public string Name { get; set; }

        public string NativeId { get; set; }

        public double? Durability { get; set; }

        public double? Energy { get; set; }

        public int? RemainedTurnTime { get; set; }
    }
}