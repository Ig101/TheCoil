using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheCoil.Api.Controllers
{
    public abstract class MediatorControllerBase : ControllerBase
    {
        protected IMediator Mediator { get; private set; }

        public MediatorControllerBase(IMediator mediator)
        {
            Mediator = mediator;
        }
    }
}