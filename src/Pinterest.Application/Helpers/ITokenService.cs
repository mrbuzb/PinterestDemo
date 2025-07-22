using System.Security.Claims;
using Pinterest.Application.Dto_s;

namespace Pinterest.Application.Helpers;

public interface ITokenService
{
    public string GenerateToken(UserGetDto user);
    public string GenerateRefreshToken();
    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}






