using System.Threading;
using System.Collections.Generic;
using System.Threading.Tasks;
using BluePlague.Domain.Operations;
using MongoDB.Driver;

namespace BluePlague.Domain {
    public class BaseMongoContext {
        private readonly MongoConnection _connection;
        private LinkedList<IOperation> _operations;
        public BaseMongoContext(MongoConnection connection) {
            _connection = connection;
            _operations = new LinkedList<IOperation>();
        }
        public IRepository<T> InitializeRepository<T>(IMongoDatabase database) {
            return new Repository<T>(_connection, database, _operations);
        }
        public async Task Save(CancellationToken token = default) {
            using(var session = _connection.StartSession()) {
                session.StartTransaction();
                try {
                    LinkedListNode<IOperation> item = _operations.First;
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