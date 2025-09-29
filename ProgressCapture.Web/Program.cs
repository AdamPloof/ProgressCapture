using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;

using ProgressCapture.Web.Data;

var builder = WebApplication.CreateBuilder(args);

// Database Setup
builder.Services.AddDbContext<ProgressCaptureDbContext>(opts => {
    opts.UseSqlite(builder.Configuration.GetConnectionString("ProgressCaptureConnection"));
});

// Add services to the container.
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllers();

app.Run();
