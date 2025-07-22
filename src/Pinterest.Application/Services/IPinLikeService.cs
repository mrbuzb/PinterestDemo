namespace Pinterest.Application.Services;

public interface IPinLikeService
{
    Task<bool> HasUserLikedAsync(long userId, long pinId);
    Task LikeAsync(long userId, long pinId);
    Task UnlikeAsync(long userId, long pinId);
}