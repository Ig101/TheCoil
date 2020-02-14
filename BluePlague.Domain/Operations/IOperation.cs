using System.Threading;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Driver.Core.Bindings;

namespace BluePlague.Domain.Operations {
    interface IOperation
    {
        Task Process(IClientSessionHandle session, CancellationToken token);
    }
}