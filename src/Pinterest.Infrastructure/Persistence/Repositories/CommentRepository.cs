using Microsoft.EntityFrameworkCore;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Repositories;

public class CommentRepository(AppDbContext _context) : ICommentRepository
{
    public async Task AddAsync(Comment comment)
    {
        await _context.Comments.AddAsync(comment);  
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Comment comment)
    {
        _context.Remove(comment);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Comment>> GetAllByPinIdAsync(long pinId)
    {
        return await _context.Comments.Include(x=>x.User).ToListAsync();
    }

    public async Task<Comment> GetByIdAsync(long id)
    {
        var comment =await _context.Comments.Include(x => x.User).FirstOrDefaultAsync(c => c.Id == id);

        if(comment is null)
        {
            throw new EntityNotFoundException();
        }
        return comment;
    }
}
