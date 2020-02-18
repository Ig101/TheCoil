using System.Threading.Tasks;
using MongoDB.Driver;

namespace BluePlague.Domain
{
    public interface IEntityConfiguration<Ttype>
    {
        Task ConfigureAsync(IMongoCollection<Ttype> collection);
    }
}