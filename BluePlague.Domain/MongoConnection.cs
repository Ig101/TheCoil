using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using BluePlague.Domain.Game;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Core.Bindings;

namespace BluePlague.Domain {
    public class MongoConnection {
        private readonly IMongoClient _client;
        public MongoConnection (IOptions<MongoConnectionSettings> connection, IServiceProvider provider) {
            _client = new MongoClient(connection.Value.ServerName);
            var tasks = Assembly
                .GetExecutingAssembly()
                .GetTypes()
                .Where(type => IsMongoContext(type.BaseType))
                .Select(type => {
                    var settingsType = typeof(MongoContextSettings<>).MakeGenericType(type);
                    var optionsType = typeof(IOptions<>).MakeGenericType(settingsType);
                    var options = provider.GetRequiredService(optionsType);
                    var instance = (BaseMongoContext)Activator.CreateInstance(type, this, optionsType);
                    return instance.ConfigureContext();
                })
                .ToArray();
            Task.WaitAll(tasks);
        }

        bool IsMongoContext(Type type) {
            if(type == typeof(BaseMongoContext)) {
                return true;
            }
            if(type == null) {
                return false;
            }
            return IsMongoContext(type.BaseType);
        }

        public IMongoDatabase GetDatabase(string name) {
            return _client.GetDatabase(name);
        }

        public IClientSessionHandle StartSession() {
            return _client.StartSession();
        }
    }
}