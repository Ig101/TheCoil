using System.Threading;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;
using BluePlague.Domain.Operations;
using MongoDB.Driver;

namespace BluePlague.Domain
{
    class Repository<T>: IRepository<T>
    {
        private readonly IMongoCollection<T> _collection;
        private readonly MongoConnection _connection;
        private readonly LinkedList<IOperation> _operations;
        public Repository(MongoConnection connection, IMongoDatabase database, LinkedList<IOperation> operationsCollection) {
            _collection = database.GetCollection<T>(nameof(T));
            _operations = operationsCollection;
            _connection = connection;
        }
        public async Task<T> GetOne(Expression<Func<T, bool>> filter, CancellationToken token = default) {
            return await _collection.Find(filter).FirstOrDefaultAsync(token);
        }

        public async Task<IEnumerable<T>> Get(Expression<Func<T, bool>> filter, CancellationToken token = default) {
            return await _collection.Find(filter).ToListAsync(token);
        }

        public async Task InsertOneAtomically(T document, CancellationToken token = default) {
            await _collection.InsertOneAsync(document, null, token);
        }

        public async Task UpdateOneAtomically(Expression<Func<T, bool>> filter, UpdateDefinition<T> update, CancellationToken token = default) {
            await _collection.UpdateOneAsync(filter, update, null, token);
        }

        public async Task ReplaceOneAtomically(Expression<Func<T, bool>> filter, T document, CancellationToken token = default) {
            await _collection.ReplaceOneAsync(filter, document, null, token);
        }

        public async Task DeleteOneAtomically(Expression<Func<T, bool>> filter, CancellationToken token = default) {
            await _collection.DeleteOneAsync(filter, null, token);
        }
        // TODO Transactional operations
    }
}