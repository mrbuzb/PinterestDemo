using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class RefreshTokenRepository(AppDbContext _context) : IRefreshTokenRepository
{
    public async Task AddRefreshToken(RefreshToken refreshToken)
    {
        await _context.RefreshTokens.AddAsync(refreshToken);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteRefreshToken(string refreshToken)
    {
        var token = await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken);
        if (token == null)
        {
            throw new EntityNotFoundException();
        }
        _context.RefreshTokens.Remove(token);
    }

    public async Task<RefreshToken> SelectRefreshToken(string refreshToken, long userId) => await _context.RefreshTokens.FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.UserId == userId);
}
