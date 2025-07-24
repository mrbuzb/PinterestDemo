using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Pinterest.Domain.Entities;

namespace Pinterest.Infrastructure.Persistence.Configurations;

public class ConfirmerConfiguration : IEntityTypeConfiguration<UserConfirme>
{
    public void Configure(EntityTypeBuilder<UserConfirme> builder)
    {
        builder.ToTable("Confirmers");

        builder.HasKey(uc => uc.ConfirmerId);

        builder.Property(uc => uc.ConfirmingCode)
            .IsRequired(false)
            .HasMaxLength(6);

        builder.HasIndex(uc => uc.Gmail)
            .IsUnique();

        builder.Property(uc => uc.ExpiredDate)
            .IsRequired()
            .HasDefaultValueSql("DATEADD(MINUTE, 10, GETUTCDATE())");

        builder.Property(uc => uc.IsConfirmed)
            .IsRequired()
            .HasDefaultValue(false);

        builder.HasOne(uc => uc.User)
            .WithOne(u => u.Confirmer)
            .HasForeignKey<UserConfirme>(uc => uc.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
