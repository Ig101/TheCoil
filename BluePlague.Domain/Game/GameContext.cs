using System.Collections;
using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BluePlague.Domain.Game {
    public class GameContext : BaseMongoContext {
        public GameContext(MongoConnection connection) : base(connection) {
            // TODO Initialize repositories
        }
    }
}