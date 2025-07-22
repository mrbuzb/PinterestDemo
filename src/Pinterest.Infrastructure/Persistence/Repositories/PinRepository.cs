using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class PinRepository(AppDbContext _context) : IPinRepository
{
    public async Task<Pin> GetByIdAsync(long pinId)
    {
        var pin =await _context.Pins.FirstOrDefaultAsync(x=>x.Id == pinId);
        if(pin == null)
        {
            throw new EntityNotFoundException();
        }
        return pin;
    }

    public async Task<List<Pin>> GetAllAsync()
    {
        return await _context.Pins.ToListAsync();
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

    public async Task<IEnumerable<Pin>> GetPinsByUserIdAsync(long userId)
    {
        return await _context.Pins.Where(x => x.CreatedById == userId).ToListAsync();
    }
}
