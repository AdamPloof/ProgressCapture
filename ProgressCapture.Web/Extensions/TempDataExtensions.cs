using System.Text.Json;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using ProgressCapture.Web.ViewModels;

namespace ProgressCapture.Web.Extensions;

/// <summary>
/// Add a flash message to be displayed at the top of the page on the next load.
/// </summary>
/// <remarks>
/// Currently, this only allows for a single flash message a time, it would
/// cool if this maintained a list so that we could have display multiple messages
/// if needed.
/// </remarks>
/// <TODO>
/// Need to serialize/deserialize FlashMessages because TempData only works with basic types.
/// </TODO>
public static class TempDataExtensions {
    public static void Put<T>(this ITempDataDictionary tempData, string key, T value) where T : class {
        tempData[key] = JsonSerializer.Serialize(value);
    }

    public static T? Get<T>(this ITempDataDictionary tempData, string key) where T : class {
        tempData.TryGetValue(key, out object? o);

        return o == null ? null : JsonSerializer.Deserialize<T>((string)o);
    }

    public static T? Peek<T>(this ITempDataDictionary tempData, string key) where T : class {
        object? o = tempData.Peek(key);

        return o == null ? null : JsonSerializer.Deserialize<T>((string)o);
    }

    public static void AddFlash(this ITempDataDictionary tempData, string message, string? type) {
        FlashMessage flash = new() {
            Message = message
        };

        if (type != null) {
            flash.Type = type;
        }

        tempData.Put("FlashMessage", flash);
    }

    public static void AddFlash(this ITempDataDictionary tempData, FlashMessage flash) {
        tempData.Put("FlashMessage", flash);
    }
}
