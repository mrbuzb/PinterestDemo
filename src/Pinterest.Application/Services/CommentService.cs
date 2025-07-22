using Pinterest.Application.Dto_s;
using Pinterest.Application.Interfaces;
using Pinterest.Core.Errors;
using Pinterest.Domain.Entities;

namespace Pinterest.Application.Services;

public class CommentService(ICommentRepository _repo) : ICommentService
{
    public async Task AddAsync(CommentCreateDto comment, long userId)
    {
        var commentEntity = new Comment
        {
            CreatedAt = DateTime.Now,
            PinId = comment.PinId,
            UserId = userId,
            Text = comment.Text,
        };
        await _repo.AddAsync(commentEntity);
    }

    public async Task DeleteAsync(long commentId, long userId)
    {
        var comment = await _repo.GetByIdAsync(commentId);
        if (comment.UserId == userId || comment.Pin.CreatedById == userId)
        {
            await _repo.DeleteAsync(comment);
            return;
        }

        throw new NotAllowedException();
    }

    public async Task<List<CommentDto>> GetAllByPinIdAsync(long pinId)
    {
        var comments = await _repo.GetAllByPinIdAsync(pinId);
        return comments.Select(Converter).ToList();
    }

    public async Task<CommentDto> GetByIdAsync(long id)
    {
        return Converter(await _repo.GetByIdAsync(id));
    }

    private CommentDto Converter(Comment comment)
    {
        return new CommentDto
        {
            CreatedAt = comment.CreatedAt,
            PinId = comment.PinId,
            Id = comment.Id,
            Text = comment.Text,
            UserName = comment.User.UserName,
        };
    }

}
