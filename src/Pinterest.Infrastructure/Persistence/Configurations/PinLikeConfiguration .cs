using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Configurations;

public class PinLikeConfiguration : IEntityTypeConfiguration<PinLike>
{
    public void Configure(EntityTypeBuilder<PinLike> builder)
    {
        builder.ToTable("PinLikes");

        builder.HasKey(pl => new { pl.UserId, pl.PinId });

        builder.Property(pl => pl.LikedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(pl => pl.User)
            .WithMany(u => u.LikedPins)
            .HasForeignKey(pl => pl.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pl => pl.Pin)
            .WithMany(p => p.Likes)
            .HasForeignKey(pl => pl.PinId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
