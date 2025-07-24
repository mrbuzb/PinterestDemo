namespace Pinterest.Domain.Entities;

public class Pin
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string ImageUrl { get; set; }
    public string Description { get; set; }
    public DateTime CreatedAt { get; set; }

    public long CreatedById { get; set; }
    public User CreatedBy { get; set; }

    public ICollection<PinLike> Likes { get; set; }
    public ICollection<Comment> Comments { get; set; }
}
