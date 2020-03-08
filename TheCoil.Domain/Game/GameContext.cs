using TheCoil.Domain.Game.Entities;

namespace TheCoil.Domain.Game
{
    public class GameContext : BaseMongoContext
    {
        public IRepository<GameMeta> GameMeta { get; set; }

        public IRepository<SceneSegment> SceneSegments { get; set; }

        public GameContext(MongoConnection connection)
            : base(connection)
        {
            GameMeta = InitializeRepository<GameMeta>();
            SceneSegments = InitializeRepository<SceneSegment>();
        }
    }
}