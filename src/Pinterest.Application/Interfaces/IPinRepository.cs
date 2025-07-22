using Pinterest.Domain.Entities;

namespace Pinterest.Application.Interfaces;

public interface IPinRepository
{
    Task<Pin> GetByIdAsync(long id);
    Task<List<Pin>> GetAllAsync();
    Task AddAsync(Pin pin);
    Task UpdateAsync(Pin pin);
    Task DeleteAsync(Pin pin);
    Task<IEnumerable<Pin>> GetPinsByUserIdAsync(long userId);
}
