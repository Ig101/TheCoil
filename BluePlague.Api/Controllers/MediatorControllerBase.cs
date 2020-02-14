using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace BluePlague.Api.Controllers
{
    public class MediatorControllerBase: ControllerBase
    {
        private readonly IMediator _mediator;

        public MediatorControllerBase(IMediator mediator) {
            _mediator = mediator;
        }
    }
}