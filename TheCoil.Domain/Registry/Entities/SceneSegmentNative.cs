using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Domain.Registry.Entities
{
    public class SceneSegmentNative
    {
        [BsonId]
        [BsonElement("id")]
        public int Id { get; set; }

        [BsonElement("nid")]
        public int? NextId { get; set; }

        [BsonElement("r")]
        [BsonRepresentation(BsonType.Int32)]
        public RoomType RoomType { get; set; }

        [BsonElement("d")]
        public int Difficulty { get; set; }
    }
}