using Pinterest.Application.Dto_s;
using Pinterest.Domain.Entities;

namespace Pinterest.Application.Services;

public interface ICommentService
{
    Task<CommentDto> GetByIdAsync(long id);
    Task<List<CommentDto>> GetAllByPinIdAsync(long pinId);
    Task AddAsync(CommentCreateDto comment,long userId);
    Task DeleteAsync(long commentId,long userId);
}