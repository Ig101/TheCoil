using System.Threading.Tasks;
using BluePlague.Domain.Game;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Bindings;

namespace BluePlague.Domain {
    public class MongoConnection {
        private readonly IMongoClient _client;
        public MongoConnection (
            IOptions<MongoConnectionSettings> connection,
            IOptions<MongoContextSettings<GameContext>> gameOptions
            ) {
          _client = new MongoClient (connection.Value.ServerName);
          var tasks = new Task[] {
              new GameContext(this, gameOptions).ConfigureContext()
          };
          Task.WaitAll(tasks);
        }

        public IMongoDatabase GetDatabase(string name) {
            return _client.GetDatabase(name);
        }

        public IClientSessionHandle StartSession() {
            return _client.StartSession();
        }
    }
}