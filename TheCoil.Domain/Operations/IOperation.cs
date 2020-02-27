using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain.Operations
{
    internal interface IOperation
    {
        Task ProcessAsync(IClientSessionHandle session, CancellationToken token);
    }
}