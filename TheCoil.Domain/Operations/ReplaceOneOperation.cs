using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain.Operations
{
    public class ReplaceOneOperation<T> : IOperation
    {
        private readonly IMongoCollection<T> _mongoCollection;
        private readonly Expression<Func<T, bool>> _filter;
        private readonly T _object;
        private readonly bool _isUpsert;

        public ReplaceOneOperation(IMongoCollection<T> mongoCollection, Expression<Func<T, bool>> filter, T obj, bool isUpsert)
        {
            _mongoCollection = mongoCollection;
            _filter = filter;
            _object = obj;
            _isUpsert = isUpsert;
        }

        public async Task ProcessAsync(IClientSessionHandle session, CancellationToken token)
        {
            var replaceOptions = new ReplaceOptions()
            {
                IsUpsert = _isUpsert
            };
            await _mongoCollection.ReplaceOneAsync(session, _filter, _object, replaceOptions, token);
        }
    }
}