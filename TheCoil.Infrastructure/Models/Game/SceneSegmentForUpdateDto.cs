using System.Collections.Generic;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Infrastructure.Models.Game
{
    public class SceneSegmentForUpdateDto
    {
        public int Difficulty { get; set; }

        public int LastSaveTurn { get; set; }

        public IEnumerable<ActorDto> Actors { get; set; }

        public IEnumerable<TileDto> Tiles { get; set; }

        public int Id { get; set; }

        public int? NextId { get; set; }
    }
}