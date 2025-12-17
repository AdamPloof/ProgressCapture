using System.Collections.Generic;

using ProgressCapture.Web.Models;

namespace ProgressCapture.Web.Data;

/// <summary>
/// IProgressLookup provides a basic repository for looking up
/// entities needed for uploading new progress entries.
/// </summary>
public interface IProgressRepository {
    public IEnumerable<Goal> GetGoalsByName(string goalName);
    public IEnumerable<ProgressType> GetProgressTypesByName(int goalId, string typeName);
    public Task AddProgress(ProgressEntry entry);
    public Task SaveChanges();
}
