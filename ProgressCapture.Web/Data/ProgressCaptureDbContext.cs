using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

using ProgressCapture.Web.Models;
using ProgressCapture.Web.Extensions;

namespace ProgressCapture.Web.Data;

public class ProgressCaptureDbContext : IdentityDbContext<AppUser> {
    public DbSet<Goal>          Goals { get; set; } = null!;
    public DbSet<ProgressType>  ProgressTypes { get; set; } = null!;
    public DbSet<ProgressEntry> ProgressEntries { get; set; } = null!;
    public DbSet<UnitOfMeasure> UnitOfMeasures { get; set; } = null!;

    public ProgressCaptureDbContext(
        DbContextOptions<ProgressCaptureDbContext> options
    ) : base(options) { }

    protected override void OnModelCreating(ModelBuilder builder) {
        base.OnModelCreating(builder);

        builder.Entity<Goal>().ToTable("goal");
        builder.Entity<ProgressType>().ToTable("progress_type");
        builder.Entity<ProgressEntry>().ToTable("progress_entry");
        builder.Entity<UnitOfMeasure>().ToTable("unit_of_measure");

        // Configuring table and columns names to use snake case
        foreach (var entity in builder.Model.GetEntityTypes()) {
            // Replace table names
            string? entityTableName = entity.GetTableName();
            if (entityTableName != null) {
                entity.SetTableName(entityTableName.ToSnakeCase());
            }

            // Replace column names            
            foreach (var property in entity.GetProperties()) {
                var declaringEntityType = property.DeclaringType as IMutableEntityType;
                if (declaringEntityType != null) {
                    string? tableName = declaringEntityType.GetTableName();
                    string? columnName = null;
                    if (tableName != null) {
                        columnName = property.GetColumnName(StoreObjectIdentifier.Table(tableName, null));
                    }

                    if (columnName != null) {
                        property.SetColumnName(columnName.ToSnakeCase());
                    }
                }
            }

            foreach (var key in entity.GetKeys()) {
                string? keyName = key.GetName();
                if (keyName != null) {
                    key.SetName(keyName.ToSnakeCase());
                }
            }

            foreach (var key in entity.GetForeignKeys()) {
                string? constraintName = key.GetConstraintName();
                if (constraintName != null) {
                    key.SetConstraintName(constraintName.ToSnakeCase());
                }
            }

            foreach (var index in entity.GetIndexes()) {
                string? indexDbName = index.GetDatabaseName();
                if (indexDbName != null) {
                    index.SetDatabaseName(indexDbName.ToSnakeCase());
                }
            }
        }
    }

}
