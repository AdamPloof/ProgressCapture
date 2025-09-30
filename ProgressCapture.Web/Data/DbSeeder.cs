using System.Collections.Generic;
using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Data;

public static class DbSeeder {
    public static async Task SeedAsync(ProgressCaptureDbContext dbContext) {
        if (dbContext.UnitOfMeasures.Any()) {
            return;
        }

        Dictionary<string, string?> uoms = new() {
            {"Hours", "hr"},
            {"Miles", "mi"},
        };

        foreach (KeyValuePair<string, string?> pair in uoms) {
            await dbContext.UnitOfMeasures.AddAsync(new UnitOfMeasure() {
                Name = pair.Key,
                ShortName = pair.Value
            });

            await dbContext.SaveChangesAsync();
        }
    }
}
