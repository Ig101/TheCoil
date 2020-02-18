using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace BluePlague.Domain
{
    public interface IRepository<T>
    {
        Task<T> GetOneAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);

        Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);

        Task InsertOneAtomicallyAsync(T document, CancellationToken token = default);

        Task UpdateOneAtomicallyAsync(Expression<Func<T, bool>> filter, UpdateDefinition<T> update, CancellationToken token = default);

        Task ReplaceOneAtomicallyAsync(Expression<Func<T, bool>> filter, T document, CancellationToken token = default);

        Task DeleteOneAtomicallyAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);
    }
}