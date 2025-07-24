using Pinterest.Application.Services;

namespace Pinterest.Api.Endpoints;

public static class PinLikeEndpoints
{
    public static void MapPinLikeEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/pinlike")
            .RequireAuthorization()
            .WithTags("PinLikeManagement");

        userGroup.MapPost("/like",
        async (long pinId,IPinLikeService _service,HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.LikeAsync(long.Parse(userId),pinId);
            return Results.Ok();
        })
        .WithName("Like");

        userGroup.MapDelete("/unlike",
        async (long pinId,IPinLikeService _service,HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.UnlikeAsync(long.Parse(userId),pinId);
            return Results.Ok();
        })
        .WithName("UnLike");

        userGroup.MapGet("/has-user-liked",
        async (long pinId,IPinLikeService _service,HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            
            return Results.Ok(await _service.HasUserLikedAsync(long.Parse(userId), pinId));
        })
        .WithName("HasUserLiked");


    }
}
