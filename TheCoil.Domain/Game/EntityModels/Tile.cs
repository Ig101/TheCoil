using MongoDB.Bson.Serialization.Attributes;

namespace TheCoil.Domain.Game.EntityModels
{
    public class Tile
    {
        [BsonElement("x")]
        public int X { get; set; }

        [BsonElement("y")]
        public int Y { get; set; }

        [BsonElement("ni")]
        public string NativeId { get; set; }
    }
}