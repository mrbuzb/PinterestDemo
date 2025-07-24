namespace Pinterest.Domain.Entities;

public class PinLike
{
    public long UserId { get; set; }
    public User User { get; set; }

    public long PinId { get; set; }
    public Pin Pin { get; set; }

    public DateTime LikedAt { get; set; }
}
