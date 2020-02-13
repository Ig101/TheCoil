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
        Task<T> GetOne(Expression<Func<T, bool>> filter, CancellationToken token = default);
        Task<IEnumerable<T>> Get(Expression<Func<T, bool>> filter, CancellationToken token = default);
        Task InsertOneAtomically(T document, CancellationToken token = default);
        Task UpdateOneAtomically(Expression<Func<T, bool>> filter, UpdateDefinition<T> update, CancellationToken token = default);
        Task ReplaceOneAtomically(Expression<Func<T, bool>> filter, T document, CancellationToken token = default);
        Task DeleteOneAtomically(Expression<Func<T, bool>> filter, CancellationToken token = default);
    }
}