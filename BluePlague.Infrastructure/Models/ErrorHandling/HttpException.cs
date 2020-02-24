using System;
using System.Collections.Generic;

namespace BluePlague.Infrastructure.Models.ErrorHandling
{
    public class HttpException : Exception
    {
        public int StatusCode { get; set; }

        public string Error { get; set; }
    }
}