using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class PinRepository(AppDbContext _context) : IPinRepository
{
    public async Task<Pin> GetByIdAsync(long pinId)
    {
        var pin =await _context.Pins.Include(x=>x.Comments).ThenInclude(x => x.User).Include(x=>x.Likes).FirstOrDefaultAsync(x=>x.Id == pinId);
        if(pin == null)
        {
            throw new EntityNotFoundException();
        }
        return pin;
    }

    public async Task<List<Pin>> GetAllAsync()
    {
        return await _context.Pins.Include(x=>x.Comments).ThenInclude(x => x.User).Include(_=>_.Likes).ToListAsync();
    }

    public async Task UpdateAsync(Pin pin)
    {
        _context.Pins.Update(pin);
        await _context.SaveChangesAsync();
    }


    public async Task AddAsync(Pin pin)
    {
        _context.Pins.Add(pin);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Pin pin)
    {
        _context.Pins.Remove(pin);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Pin>> GetPinsByUserIdAsync(long userId)
    {
        return await _context.Pins.Include(x=>x.Likes).Include(x=>x.Comments).ThenInclude(x=>x.User).Where(x => x.CreatedById == userId).ToListAsync();
    }
}
