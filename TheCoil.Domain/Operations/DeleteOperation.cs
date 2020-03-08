using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain.Operations
{
    public class DeleteOperation<T> : IOperation
    {
        private readonly IMongoCollection<T> _mongoCollection;

        private readonly Expression<Func<T, bool>> _filter;

        public DeleteOperation(IMongoCollection<T> mongoCollection, Expression<Func<T, bool>> filter)
        {
            _mongoCollection = mongoCollection;
            _filter = filter;
        }

        public async Task ProcessAsync(IClientSessionHandle session, CancellationToken token)
        {
            await _mongoCollection.DeleteManyAsync(session, _filter, null, token);
        }
    }
}