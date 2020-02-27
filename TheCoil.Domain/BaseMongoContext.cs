using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TheCoil.Domain.Operations;

namespace TheCoil.Domain
{
    public abstract class BaseMongoContext
    {
        private readonly MongoConnection _connection;
        private readonly Queue<IOperation> _operations;

        public BaseMongoContext(MongoConnection connection)
        {
            _connection = connection;
            _operations = new Queue<IOperation>();
        }

        public async Task ApplyChangesAsync(CancellationToken token = default)
        {
            using var session = _connection.StartSession();
            session.StartTransaction();
            try
            {
                var item = _operations.Dequeue();
                while (item != null)
                {
                    await item.ProcessAsync(session, token);
                    item = _operations.Dequeue();
                }

                await session.CommitTransactionAsync(token);
                _operations.Clear();
            }
            catch
            {
                await session.AbortTransactionAsync(token);
                throw;
            }
        }

        protected IRepository<T> InitializeRepository<T>()
        {
            var result = new Repository<T>(_connection, _operations);
            return result;
        }
    }
}