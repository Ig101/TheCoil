using System.Collections.Generic;
using System.Linq;
using BluePlague.Infrastructure.Models.ErrorHandling;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Formatters.Xml;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace BluePlague.Api.Filters
{
    public class ExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            if (context.Exception is HttpException httpException)
            {
                var factory = context.HttpContext.RequestServices?.GetRequiredService<ProblemDetailsFactory>();
                var details = factory.CreateProblemDetails(context.HttpContext, httpException.StatusCode, httpException.Error);
                context.Result = new ObjectResult(details)
                {
                    StatusCode = httpException.StatusCode
                };
                context.Result = new StatusCodeResult(httpException.StatusCode);
            }
            else if (context.Exception is ValidationErrorsException validationException)
            {
                foreach (var error in validationException.Errors)
                {
                    context.ModelState.AddModelError(error.Key, error.Description);
                }

                var factory = context.HttpContext.RequestServices?.GetRequiredService<ProblemDetailsFactory>();
                var details = factory.CreateValidationProblemDetails(context.HttpContext, context.ModelState, 400);
                context.Result = new ObjectResult(details)
                {
                    StatusCode = 400
                };
            }
            else
            {
                var factory = context.HttpContext.RequestServices?.GetRequiredService<ProblemDetailsFactory>();
                context.Result = new ObjectResult(factory.CreateProblemDetails(context.HttpContext, 500, null, null, context.Exception.Message))
                    {
                        StatusCode = 500
                    };
            }
        }
    }
}