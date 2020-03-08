using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using TheCoil.Domain.Game.EntityModels;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Domain.Game.Entities
{
    public class GameMeta
    {
        [BsonId]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("uin")]
        public string UserName { get; set; }

        [BsonElement("s")]
        public string Session { get; set; }

        [BsonElement("i")]
        public int Incrementor { get; set; }

        [BsonElement("w")]
        public int Width { get; set; }

        [BsonElement("h")]
        public int Height { get; set; }

        [BsonElement("t")]
        public int Turn { get; set; }

        [BsonElement("gs")]
        [BsonRepresentation(BsonType.Int32)]
        public GameState GameState { get; set; }

        [BsonElement("ps")]
        public int PlayerScene { get; set; }

        [BsonElement("p")]
        public Actor PlayerActor { get; set; }

        [BsonElement("sd")]
        public DateTime StartDate { get; set; }

        [BsonElement("ld")]
        public DateTime LastDate { get; set; }
    }
}