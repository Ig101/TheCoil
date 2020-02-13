using System;
using System.Runtime.Serialization;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace BluePlague.Domain.Game {
    public class GameContext : BaseMongoContext {
        private readonly IMongoDatabase _database;
        public GameContext(MongoConnection connection, IOptions<MongoContextSettings<GameContext>> options) : base(connection) {
            _database = connection.GetDatabase(options.Value.DatabaseName);
            // TODO Initialize repositories
        }

        public override async Task ConfigureContext()
        {
            
        }
    }
}