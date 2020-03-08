using MongoDB.Bson.Serialization.Attributes;

namespace TheCoil.Domain.Game.EntityModels
{
    public class Actor
    {
        [BsonElement("id")]
        public int Id { get; set; }

        [BsonElement("x")]
        public int X { get; set; }

        [BsonElement("y")]
        public int Y { get; set; }

        [BsonElement("n")]
        public string Name { get; set; }

        [BsonElement("ni")]
        public string NativeId { get; set; }

        [BsonElement("d")]
        public double? Durability { get; set; }

        [BsonElement("e")]
        public double? Energy { get; set; }

        [BsonElement("r")]
        public int? RemainedTurnTime { get; set; }
    }
}