using System.Threading.Tasks;
using MongoDB.Driver;

namespace TheCoil.Domain
{
    public interface IEntityConfiguration<Ttype>
    {
        Task ConfigureAsync(IMongoCollection<Ttype> collection);
    }
}