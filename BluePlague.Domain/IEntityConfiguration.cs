using System.Threading.Tasks;
using MongoDB.Driver;

namespace BluePlague.Domain {
    public interface IEntityConfiguration<Ttype> {
        Task Configure(IMongoCollection<Ttype> collection);
    }
}