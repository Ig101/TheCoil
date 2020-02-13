using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BluePlague.Domain.Game {
    public class GameContext : BaseMongoContext {
        public GameContext(MongoConnection connection, IOptions<MongoContextSettings<GameContext>> options) : base(connection) {
            var database = connection.GetDatabase(options.Value.DatabaseName);
            // TODO Initialize repositories
        }
    }
}