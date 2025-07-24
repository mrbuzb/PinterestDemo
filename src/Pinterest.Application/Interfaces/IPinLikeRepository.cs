namespace Pinterest.Application.Interfaces;

public interface IPinLikeRepository
{
    Task<bool> HasUserLikedAsync(long userId, long pinId);
    Task LikeAsync(long userId, long pinId);
    Task UnlikeAsync(long userId, long pinId);
}
