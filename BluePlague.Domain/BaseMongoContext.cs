using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using BluePlague.Domain.Operations;
using MongoDB.Driver;
using System;

namespace BluePlague.Domain {
    public class BaseMongoContext {
        private readonly MongoConnection _connection;
        private LinkedList<IOperation> _operations;
        public BaseMongoContext(MongoConnection connection) {
            _connection = connection;
            _operations = new LinkedList<IOperation>();
        }
        public async Task<IRepository<T>> InitializeRepository<T>(IMongoDatabase database, IEntityConfiguration<T> config) {
            var result = new Repository<T>(_connection, database, _operations);
            if (config != null) {
                await result.Configure(config);
            }
            return result;
        }
        public async Task ApplyChanges(CancellationToken token = default) {
            using(var session = _connection.StartSession()) {
                session.StartTransaction();
                try {
                    var item = _operations.First;
                    while(item != null) {
                        await item.Value.Process(session, token);
                        item = item.Next;
                    }
                    await session.CommitTransactionAsync(token);
                    _operations.Clear();
                } catch {
                    await session.AbortTransactionAsync(token);
                    throw;
                }
            }
        }
    }
}