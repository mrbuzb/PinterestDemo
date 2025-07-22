using Pinterest.Domain.Entities;

namespace Pinterest.Application.Dto_s;

public class CommentCreateDto
{
    public string Text { get; set; }
    public DateTime CreatedAt { get; set; }
    public long PinId { get; set; }
}
