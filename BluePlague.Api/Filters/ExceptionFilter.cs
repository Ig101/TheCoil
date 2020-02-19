using System.Linq;
using BluePlague.Infrastructure.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace BluePlague.Api.Filters
{
  public class ExceptionFilter : IExceptionFilter
  {
    public void OnException(ExceptionContext context)
    {
        if (context.Exception is HttpException httpException)
        {
            if (httpException.Errors == null || httpException.Errors.Count() == 0)
            {
                context.Result = new StatusCodeResult(httpException.StatusCode);
            }
            else
            {
                foreach (var error in httpException.Errors)
                {
                    context.ModelState.AddModelError(error.Key, error.Description);
                }

                context.Result = new ObjectResult(context.ModelState)
                {
                    StatusCode = httpException.StatusCode
                };
            }

            return;
        }

        context.ModelState.AddModelError("unhandled", context.Exception.Message);
        context.Result = new ObjectResult(context.ModelState)
        {
            StatusCode = 500
        };
    }
  }
}