using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Domain.Entities;
using Pinterest.Infrastructure.Persistence;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class PinLikeRepository(AppDbContext _context) : IPinLikeRepository
{
    public async Task<bool> HasUserLikedAsync(long userId, long pinId)
    {
        return await _context.PinLikes
            .AnyAsync(pl => pl.UserId == userId && pl.PinId == pinId);
    }

    public async Task LikeAsync(long userId, long pinId)
    {
        bool alreadyLiked = await HasUserLikedAsync(userId, pinId);
        if (!alreadyLiked)
        {
            var pinLike = new PinLike
            {
                UserId = userId,
                PinId = pinId,
                LikedAt = DateTime.UtcNow
            };

            _context.PinLikes.Add(pinLike);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UnlikeAsync(long userId, long pinId)
    {
        var pinLike = await _context.PinLikes
            .FirstOrDefaultAsync(pl => pl.UserId == userId && pl.PinId == pinId);

        if (pinLike != null)
        {
            _context.PinLikes.Remove(pinLike);
            await _context.SaveChangesAsync();
        }
    }
}
