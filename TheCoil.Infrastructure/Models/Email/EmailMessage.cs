namespace TheCoil.Infrastructure.Models.Email
{
    public class EmailMessage
    {
        public string[] ToAdresses { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }
    }
}