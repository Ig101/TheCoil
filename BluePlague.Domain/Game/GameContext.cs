namespace BluePlague.Domain.Game
{
    public class GameContext : BaseMongoContext
    {
        public GameContext(MongoConnection connection)
            : base(connection)
        {
            // TODO Initialize repositories
        }
    }
}