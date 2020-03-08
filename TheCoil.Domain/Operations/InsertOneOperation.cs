using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain.Operations
{
    public class InsertOneOperation<T> : IOperation
    {
        private readonly IMongoCollection<T> _mongoCollection;

        private readonly T _object;

        public InsertOneOperation(IMongoCollection<T> mongoCollection, T obj)
        {
            _mongoCollection = mongoCollection;
            _object = obj;
        }

        public async Task ProcessAsync(IClientSessionHandle session, CancellationToken token)
        {
            await _mongoCollection.InsertOneAsync(session, _object, null, token);
        }
    }
}