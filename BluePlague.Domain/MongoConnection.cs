using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.Core.Bindings;

namespace BluePlague.Domain {
    public class MongoConnection {
        private readonly IMongoClient _client;
        public MongoConnection (IOptions<MongoConnectionSettings> connection) {
          _client = new MongoClient (connection.Value.ServerName);
        }

        public IMongoDatabase GetDatabase(string name) {
            return _client.GetDatabase(name);
        }

        public IClientSessionHandle StartSession() {
            return _client.StartSession();
        }
    }
}