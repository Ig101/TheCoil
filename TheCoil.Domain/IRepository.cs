using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain
{
    public interface IRepository<T>
    {
        Task<T> GetOneAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);

        Task<Tprojection> GetOneAsync<Tprojection>(Expression<Func<T, bool>> filter, Expression<Func<T, Tprojection>> projection, CancellationToken token = default);

        Task<IEnumerable<T>> GetAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);

        Task<IEnumerable<Tprojection>> GetAsync<Tprojection>(Expression<Func<T, bool>> filter, Expression<Func<T, Tprojection>> projection, CancellationToken token = default);

        Task InsertOneAtomicallyAsync(T document, CancellationToken token = default);

        Task UpdateOneAtomicallyAsync(Expression<Func<T, bool>> filter, UpdateDefinition<T> update, CancellationToken token = default);

        Task ReplaceOneAtomicallyAsync(Expression<Func<T, bool>> filter, T document, bool isUpsert = false, CancellationToken token = default);

        Task DeleteOneAtomicallyAsync(Expression<Func<T, bool>> filter, CancellationToken token = default);

        void Insert(IEnumerable<T> objects);

        void InsertOne(T obj);

        void Update(Expression<Func<T, bool>> filter, UpdateDefinition<T> update);

        void ReplaceOne(Expression<Func<T, bool>> filter, T obj, bool isUpsert = false);

        void Delete(Expression<Func<T, bool>> filter);
    }
}