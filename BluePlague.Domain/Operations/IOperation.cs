using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace BluePlague.Domain.Operations
{
    internal interface IOperation
    {
        Task ProcessAsync(IClientSessionHandle session, CancellationToken token);
    }
}