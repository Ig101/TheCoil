using System;
using System.Collections.Generic;

namespace TheCoil.Infrastructure.Models.ErrorHandling
{
    public class ValidationErrorsException : Exception
    {
        public IEnumerable<HttpErrorInfo> Errors { get; set; }
    }
}