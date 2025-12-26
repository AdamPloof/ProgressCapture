namespace ProgressCapture.Web.ViewModels;

public class FlashMessage {
    public string Type { get; set; } = "info";
    public required string Message { get; set; }
}
