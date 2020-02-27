using System.Threading;
using System.Threading.Tasks;
using MediatR;
using TheCoil.Domain.Identity;
using TheCoil.Infrastructure.Models.User;

namespace TheCoil.Mediation.Users.Queries.GetActiveUser
{
    public class GetActiveUserQuery : IRequest<ActiveUserDto>
    {
        public string UserName { get; set; }

        private class Handler : IRequestHandler<GetActiveUserQuery, ActiveUserDto>
        {
            private readonly IdentityUserManager _userManager;

            public Handler(
                IdentityUserManager userManager)
            {
                _userManager = userManager;
            }

            public async Task<ActiveUserDto> Handle(GetActiveUserQuery request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByNameAsync(request.UserName);
                return new ActiveUserDto()
                {
                    Name = user.ViewName,
                    UniqueId = user.UserName,
                    Email = user.Email
                };
            }
        }
    }
}