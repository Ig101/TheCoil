using System;
using System.Collections.Generic;

namespace BluePlague.Infrastructure.Models
{
    public class HttpException : Exception
    {
        public int StatusCode { get; set; }

        public IEnumerable<HttpErrorInfo> Errors { get; set; }
    }
}