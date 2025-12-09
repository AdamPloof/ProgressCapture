using System;

namespace ProgressCapture.Web.Exceptions;

[Serializable]
public class InvalidUploadException : Exception {
    public InvalidUploadException() { }

    public InvalidUploadException(string message) : base(message) { }

    public InvalidUploadException(string message, Exception innerException)
        : base(message, innerException) { }
}
