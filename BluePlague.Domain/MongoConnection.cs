using System.Collections.Generic;
using System;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using BluePlague.Domain.Game;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace BluePlague.Domain {
    public class MongoConnection {
        private readonly IMongoClient _client;
        private readonly IDictionary<string, object> _collections = new Dictionary<string, object>();
        public MongoConnection (IOptions<MongoConnectionSettings> connection, IServiceProvider provider, IOptions<MongoContextSettings<GameContext>> p) {
            _client = new MongoClient(connection.Value.ServerName);
            var types = Assembly
                .GetExecutingAssembly()
                .GetTypes()
                .Where(type => IsMongoContext(type.BaseType))
                .ToList();
            var configTypes = Assembly
                .GetExecutingAssembly()
                .GetTypes()
                .Select(type => new {
                    EntityType = GetMongoConfigEntity(type),
                    Type = type
                })
                .Where(type => type.EntityType != null)
                .ToList();
            foreach(var type in types) {
                var entities = type
                    .GetProperties()
                    .Where(x => x.PropertyType.IsGenericType && x.PropertyType.GetGenericTypeDefinition() == typeof(IRepository<>))
                    .Select(x => x.PropertyType.GetGenericArguments().First())
                    .ToList();
                var settingsType = typeof(MongoContextSettings<>).MakeGenericType(type);
                var optionsType = typeof(IOptions<>).MakeGenericType(settingsType);
                var options = provider.GetRequiredService(optionsType);
                var config = (IMongoContextSettings)optionsType.GetProperty("Value").GetValue(options);
                var database = _client.GetDatabase(config.DatabaseName);
                foreach(var entity in entities) {
                    var method = database.GetType().GetMethod("GetCollection").MakeGenericMethod(entity);
                    var collection = method.Invoke(database, new object[]{ entity.Name, null });
                    _collections.Add(entity.FullName, collection);
                    var entityConfigs = configTypes.Where(x => x.EntityType == entity).Select(x => x.Type).ToList();
                    foreach(var entityConfig in entityConfigs) {
                        var instance = Activator.CreateInstance(entityConfig);
                        ((Task)entityConfig.GetMethod("Configure").Invoke(instance, new object[]{collection})).Wait();
                    }
                }
            }
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

        Type GetMongoConfigEntity(Type type) {
            if(type != null) {
                var configuration = type.GetInterfaces().FirstOrDefault(x => x.IsGenericType && x.GetGenericTypeDefinition() == typeof(IEntityConfiguration<>));
                if(configuration != null) {
                    return configuration.GetGenericArguments().First();
                }
            }
            if(type == null) {
                return null;
            }
            return GetMongoConfigEntity(type.BaseType);
        }

        public IMongoCollection<T> GetCollection<T>() {
            return (IMongoCollection<T>)_collections[typeof(T).FullName];
        }

        public IClientSessionHandle StartSession() {
            return _client.StartSession();
        }
    }
}