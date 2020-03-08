using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using TheCoil.Domain.Operations;

namespace TheCoil.Domain
{
  internal class Repository<T> : IRepository<T>
    {
        private readonly IMongoCollection<T> _collection;
        private readonly Queue<IOperation> _operations;

        public Repository(MongoConnection connection, Queue<IOperation> operationsCollection)
        {
            _collection = connection.GetCollection<T>();
            _operations = operationsCollection;
        }

        public async Task<T> GetOneAsync(Expression<Func<T, bool>> filter, CancellationToken token = default)
        {
            return await _collection.Find(filter).FirstOrDefaultAsync(token);
        }

        public async Task<Tprojection> GetOneAsync<Tprojection>(Expression<Func<T, bool>> filter, Expression<Func<T, Tprojection>> projection, CancellationToken token = default)
        {
            return await _collection.Find(filter).Project(projection).FirstOrDefaultAsync(token);
        }

        public async Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, CancellationToken token = default)
        {
            return await _collection.Find(filter).ToListAsync(token);
        }

        public async Task<IEnumerable<Tprojection>> GetAsync<Tprojection>(Expression<Func<T, bool>> filter, Expression<Func<T, Tprojection>> projection, CancellationToken token = default)
        {
            return await _collection.Find(filter).Project(projection).ToListAsync(token);
        }

        public async Task InsertOneAtomicallyAsync(T document, CancellationToken token = default)
        {
            await _collection.InsertOneAsync(document, null, token);
        }

        public async Task UpdateOneAtomicallyAsync(Expression<Func<T, bool>> filter, UpdateDefinition<T> update, CancellationToken token = default)
        {
            await _collection.UpdateOneAsync(filter, update, null, token);
        }

        public async Task ReplaceOneAtomicallyAsync(Expression<Func<T, bool>> filter, T document, bool isUpsert = false, CancellationToken token = default)
        {
            var replaceOptions = new ReplaceOptions()
            {
                IsUpsert = isUpsert
            };
            await _collection.ReplaceOneAsync(filter, document, replaceOptions, token);
        }

        public async Task DeleteOneAtomicallyAsync(Expression<Func<T, bool>> filter, CancellationToken token = default)
        {
            await _collection.DeleteOneAsync(filter, null, token);
        }

        public void Insert(IEnumerable<T> objects)
        {
            _operations.Enqueue(new InsertOperation<T>(_collection, objects));
        }

        public void InsertOne(T obj)
        {
            _operations.Enqueue(new InsertOneOperation<T>(_collection, obj));
        }

        public void Update(Expression<Func<T, bool>> filter, UpdateDefinition<T> update)
        {
            _operations.Enqueue(new UpdateOperation<T>(_collection, filter, update));
        }

        public void ReplaceOne(Expression<Func<T, bool>> filter, T obj, bool isUpsert = false)
        {
            _operations.Enqueue(new ReplaceOneOperation<T>(_collection, filter, obj, isUpsert));
        }

        public void Delete(Expression<Func<T, bool>> filter)
        {
            _operations.Enqueue(new DeleteOperation<T>(_collection, filter));
        }
    }
}