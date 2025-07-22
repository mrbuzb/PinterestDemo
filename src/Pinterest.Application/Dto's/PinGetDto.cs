using Pinterest.Domain.Entities;

namespace Pinterest.Application.Dto_s;

public class PinGetDto
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string ImageUrl { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public long CreatedById { get; set; }
    public long LikesCount { get; set; }
    public ICollection<CommentDto> Comments { get; set; }
}
