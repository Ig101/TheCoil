using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain.Operations
{
    public class InsertOperation<T> : IOperation
    {
        private readonly IMongoCollection<T> _mongoCollection;

        private readonly IEnumerable<T> _objects;

        public InsertOperation(IMongoCollection<T> mongoCollection, IEnumerable<T> objects)
        {
            _mongoCollection = mongoCollection;
            _objects = objects;
        }

        public async Task ProcessAsync(IClientSessionHandle session, CancellationToken token)
        {
            await _mongoCollection.InsertManyAsync(session, _objects, null, token);
        }
    }
}