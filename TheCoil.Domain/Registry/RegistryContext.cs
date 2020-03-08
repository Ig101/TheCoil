using TheCoil.Domain.Registry.Entities;

namespace TheCoil.Domain.Registry
{
    public class RegistryContext : BaseMongoContext
    {
        public IRepository<SceneSegmentNative> SceneSegments { get; set; }

        public RegistryContext(MongoConnection connection)
        : base(connection)
        {
            SceneSegments = InitializeRepository<SceneSegmentNative>();
        }
    }
}