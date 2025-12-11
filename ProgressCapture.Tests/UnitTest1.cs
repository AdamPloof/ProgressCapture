using ProgressCapture.Web.Services;

namespace ProgressCapture.Tests;

public class UnitTest1 {
    [Fact]
    public void Test1() {
        DummyService dummy = new();
        Assert.Equal(42, dummy.Foo());
    }
}
