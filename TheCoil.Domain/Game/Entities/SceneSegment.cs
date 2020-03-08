using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using TheCoil.Domain.Game.EntityModels;
using TheCoil.Infrastructure.Enums;

namespace TheCoil.Domain.Game.Entities
{
    public class SceneSegment
    {
        [BsonId]
        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("gid")]
        public Guid GameId { get; set; }

        [BsonElement("s")]
        public int Seed { get; set; }

        [BsonElement("r")]
        [BsonRepresentation(BsonType.Int32)]
        public RoomType RoomType { get; set; }

        [BsonElement("d")]
        public int Difficulty { get; set; }

        [BsonElement("l")]
        public int LastSaveTurn { get; set; }

        [BsonElement("as")]
        public IEnumerable<Actor> Actors { get; set; }

        [BsonElement("ts")]
        public IEnumerable<Tile> Tiles { get; set; }

        [BsonElement("i")]
        public int SceneId { get; set; }

        [BsonElement("ni")]
        public int? NextSceneId { get; set; }
    }
}