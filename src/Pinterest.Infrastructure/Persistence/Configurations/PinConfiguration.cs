using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Configurations;

public class PinConfiguration : IEntityTypeConfiguration<Pin>
{
    public void Configure(EntityTypeBuilder<Pin> builder)
    {
        builder.ToTable("Pins");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Title)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(p => p.ImageUrl)
            .IsRequired();

        builder.Property(p => p.Description)
            .HasMaxLength(1000);

        builder.Property(p => p.CreatedAt)
            .HasDefaultValueSql("GETUTCDATE()");

        builder.HasOne(p => p.CreatedBy)
            .WithMany(u => u.Pins)
            .HasForeignKey(p => p.CreatedById)
            .OnDelete(DeleteBehavior.Cascade);
    }
}