using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.AspNetCore.Identity;

using Serilog;
using Serilog.Events;

using ProgressCapture.Web.Data;
using ProgressCapture.Web.Services;
using ProgressCapture.Web.Configuration;
using ProgressCapture.Web.Models;
using Microsoft.AspNetCore.Authorization;

// The initial "bootstrap" logger is able to log errors during start-up. It's completely replaced by the
// logger configured in `AddSerilog()` below, once configuration and dependency-injection have both been
// set up successfully.
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try {
    Log.Information("Starting Progress Capture");

    var builder = WebApplication.CreateBuilder(args);

    // Logging
    builder.Services.AddSerilog((services, lc) => lc
        .ReadFrom.Configuration(builder.Configuration)
        .ReadFrom.Services(services)
        .Enrich.FromLogContext()
        .WriteTo.Logger(lc => lc
            .Filter.ByIncludingOnly(evt =>
                evt.Properties.TryGetValue("SourceContext", out var sourceContext)
                && sourceContext.ToString().Contains("Microsoft.AspNetCore")
            )
            .WriteTo.Console()
        )
        .WriteTo.Logger(lc => lc
            .Filter.ByExcluding(evt =>
                evt.Properties.TryGetValue("SourceContext", out var sourceContext)
                && sourceContext.ToString().Contains("Microsoft.AspNetCore")
            )
            // TODO: change log file name to reflect environment
            .WriteTo.File("./logs/dev_.log", rollingInterval: RollingInterval.Day)
        )
    );

    builder.Services.Configure<FileUploadOptions>(
        builder.Configuration.GetSection("FileUploadOptions")
    );

    // Database Setup
    builder.Services.AddDbContext<ProgressCaptureDbContext>(opts => {
        opts.UseSqlite(builder.Configuration.GetConnectionString("ProgressCaptureConnection"));
    });

    // Identity
    builder.Services.AddDefaultIdentity<AppUser>(opts => {
        opts.SignIn.RequireConfirmedAccount = true;
    }).AddEntityFrameworkStores<ProgressCaptureDbContext>();
    builder.Services.AddAuthorization(opts => {
        opts.FallbackPolicy = new AuthorizationPolicyBuilder()
            .RequireAuthenticatedUser()
            .Build();
    });

    // Add services to the container.
    builder.Services.AddControllersWithViews();
    builder.Services.AddRazorPages();
    builder.Services.AddHttpContextAccessor();
    builder.Services.AddScoped<IServiceSecurity, ServiceSecurity>();
    builder.Services.AddScoped<IProgressRepository, ProgressRepository>();
    builder.Services.AddScoped<IUserGoalLoader, UserGoalLoader>();
    builder.Services.AddScoped<IUploadHelper, ProgressUploadHelper>();

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
    app.MapStaticAssets()
        .AllowAnonymous();
    app.UseRouting();

    app.UseAuthentication();
    app.UseAuthorization();
    app.UseSerilogRequestLogging();

    app.MapRazorPages();
    app.MapControllers();

    app.Run();
} catch (Exception ex) {
    Log.Fatal(ex, "Application terminated unexpectedly");
} finally {
    Log.CloseAndFlush();
}
