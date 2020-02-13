using System.Threading.Tasks;
using MongoDB.Driver;

namespace BluePlague.Domain
{
    public interface IEntityConfiguration<T>
    {
        Task Configure(IMongoCollection<T> collection);
    }
}