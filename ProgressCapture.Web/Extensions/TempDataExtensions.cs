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
    public static void AddFlash(this ITempDataDictionary tempData, string message, string? type) {
        FlashMessage flash = new() {
            Message = message
        };

        if (type != null) {
            flash.Type = type;
        }

        tempData["FlashMessage"] = flash;
    }

    public static void AddFlash(this ITempDataDictionary tempData, FlashMessage flash) {
        tempData["FlashMessage"] = flash;
    }
}
