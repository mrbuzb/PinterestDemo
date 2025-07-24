using Pinterest.Application.Dto_s;
using Pinterest.Domain.Entities;

namespace Pinterest.Application.Services;

public interface IPinService
{
    Task<PinGetDto> GetByIdAsync(long id);
    Task<List<PinGetDto>> GetAllAsync();
    Task AddAsync(PinCreateDto pin,long userId);
    //Task UpdateAsync(Pin pin);
    Task DeleteAsync(long pinId,long userId);
    Task<List<PinGetDto>> GetPinsByUserIdAsync(long userId);
}