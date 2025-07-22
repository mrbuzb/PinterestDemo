using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class UserRoleRepository(AppDbContext _context) : IRoleRepository
{
    public async Task<List<UserRole>> GetAllRolesAsync() => await _context.UserRoles.ToListAsync();

    public async Task<ICollection<User>> GetAllUsersByRoleAsync(string role)
    {
        var foundRole = await _context.UserRoles.Include(u => u.Users).ThenInclude(u => u.Confirmer).FirstOrDefaultAsync(_ => _.Name == role);
        if (foundRole is null)
        {
            throw new EntityNotFoundException(role);
        }
        return foundRole.Users;
    }

    public async Task<long> GetRoleIdAsync(string role)
    {
        var foundRole = await _context.UserRoles.FirstOrDefaultAsync(_ => _.Name == role);
        if (foundRole is null)
        {
            throw new EntityNotFoundException(role + " - not found");
        }
        return foundRole.Id;
    }
}
