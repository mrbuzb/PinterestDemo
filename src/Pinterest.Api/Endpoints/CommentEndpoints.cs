using Azure.Core.Pipeline;
using Microsoft.AspNetCore.Authorization;
using Pinterest.Application.Dto_s;
using Pinterest.Application.Services;

namespace Pinterest.Api.Endpoints;

public static class CommentEndpoints
{
    public static void MapCommentEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/comment")
            .RequireAuthorization()
            .WithTags("CommentManagement");


        userGroup.MapPost("/add",
        async (CommentCreateDto comment,ICommentService _service,HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.AddAsync(comment,long.Parse(userId));
            return Results.Ok();
        })
        .WithName("AddComment");



        userGroup.MapGet("/get-all-by-pin-id",
        async (long pinId,ICommentService _service) =>
        {
            return Results.Ok(await _service.GetAllByPinIdAsync(pinId));
        })
        .WithName("GetAllByPinId");


        userGroup.MapGet("/get-by-id",
        async (long commentId,ICommentService _service) =>
        {
            return Results.Ok(await _service.GetByIdAsync(commentId));
        })
        .WithName("GetByPinId");


        userGroup.MapDelete("/delete",
        async (long commentId,ICommentService _service,HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.DeleteAsync(commentId,long.Parse(userId));
            return Results.Ok();
        })
        .WithName("DeleteComment");

    }
}
