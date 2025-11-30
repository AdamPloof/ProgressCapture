using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Services;

var builder = WebApplication.CreateBuilder(args);

// Database Setup
builder.Services.AddDbContext<ProgressCaptureDbContext>(opts => {
    opts.UseSqlite(builder.Configuration.GetConnectionString("ProgressCaptureConnection"));
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IUserGoalLoader, UserGoalLoader>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
} else {
    using (AsyncServiceScope scope = app.Services.CreateAsyncScope()) {
        IServiceProvider services = scope.ServiceProvider;
        var dbContext = services.GetRequiredService<ProgressCaptureDbContext>();
        await DbSeeder.SeedAsync(dbContext);
    }
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllers();

app.Run();
