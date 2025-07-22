using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.Mvc;
using Pinterest.Application.Dto_s;
using Pinterest.Application.Services;
using Microsoft.AspNetCore.Antiforgery;
namespace Pinterest.Api.Endpoints;

public static class PinEndpoints
{
    public static void MapPinEndpoints(this WebApplication app)
    {
        var userGroup = app.MapGroup("/api/pin")
            .RequireAuthorization()
            .WithTags("PinManagement");



        userGroup.MapGet("/get-by-id",
        async (long pinId, IPinService _service, HttpContext context) =>
        {
            return Results.Ok(await _service.GetByIdAsync(pinId));
        })
        .WithName("GetPinById");



        userGroup.MapGet("/get-all",
        async (IPinService _service, HttpContext context) =>
        {
            return Results.Ok(await _service.GetAllAsync());
        })
        .WithName("GetAllPin");


        userGroup.MapPost("/add",
        async ([FromForm] PinHelper pin,IFormFile img, IPinService _service, HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            var pinDto = new PinCreateDto
            {
                Title = pin.Title,
                Image = img,
                Description = pin.Description,
            };
            await _service.AddAsync(pinDto, long.Parse(userId));
            return Results.Ok();
        })
        .WithName("AddPin").DisableAntiforgery(); ;


        userGroup.MapDelete("/delete",
        async (long pinId, IPinService _service, HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            await _service.DeleteAsync(pinId,long.Parse(userId));
            return Results.Ok();
        })
        .WithName("DeletePin");


        userGroup.MapGet("/get-by-user",
        async (IPinService _service, HttpContext context) =>
        {
            var userId = context.User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                throw new UnauthorizedAccessException();
            }
            var result = await _service.GetPinsByUserIdAsync(long.Parse(userId));
            return Results.Ok(result);
        })
        .WithName("GetPinByUser");



    }
}
