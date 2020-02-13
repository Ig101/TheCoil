using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BluePlague.Domain.Game {
    public class GameContext : BaseMongoContext {
        public GameContext(MongoConnection connection, IOptions<MongoContextSettings<GameContext>> options) : base(connection) {
            var database = connection.GetDatabase(options.Value.DatabaseName);
            var tasks = new Task[] {
                // TODO Initialize repositories
            };
            Task.WaitAll(tasks);
        }
    }
}