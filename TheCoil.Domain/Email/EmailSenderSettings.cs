namespace TheCoil.Domain.Email
{
    public class EmailSenderSettings
    {
        public string SmtpHost { get; set; }

        public int SmtpPort { get; set; }

        public string SmtpLogin { get; set; }

        public string SmtpPassword { get; set; }

        public string FromName { get; set; }

        public string FromAdress { get; set; }
    }
}