using FluentValidation;
using Pinterest.Application.Dto_s;
using Pinterest.Application.Helpers;
using Pinterest.Application.Interfaces;
using Pinterest.Application.Services;
using Pinterest.Application.Validators;
using Pinterest.Infrastructure.Persistence.Repositories;

namespace Pinterest.Api.Configurations;

public static class DependecyInjectionsConfiguration
{
    public static void ConfigureDependecies(this IServiceCollection services)
    {
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IPinRepository, PinRepository>();
        services.AddScoped<IPinService, PinService>();
        services.AddScoped<IPinLikeRepository, PinLikeRepository>();
        services.AddScoped<IPinLikeService, PinLikeService>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<ICommentService, CommentService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IRoleRepository, UserRoleRepository>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IValidator<UserCreateDto>, UserCreateDtoValidator>();
        services.AddScoped<IValidator<UserLoginDto>, UserLoginDtoValidator>();
    }
}
