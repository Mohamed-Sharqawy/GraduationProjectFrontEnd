

using Homy.Application.Service;
using Homy.Application.Service.ApiServices;
using Homy.Application.Contract_Service;
using Homy.Application.Contract_Service.ApiServices;
using Homy.Domin.models;
using Homy.Domin.Contract_Repo;
using Homy.Infurastructure.Data;
using Homy.Infurastructure.Repository;
using Homy.Infurastructure.Unitofworks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Homy.api
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();

            // Configure DbContext
            builder.Services.AddDbContext<HomyContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // Register Repositories
            builder.Services.AddScoped(typeof(IGenric_Repo<>), typeof(Genric_Repo<>));
            builder.Services.AddScoped<ICity_Repo, City_Repo>();
            builder.Services.AddScoped<IDistrict_Repo, District_Repo>();
            builder.Services.AddScoped<IProperty_Repo, Property_Repo>();
            builder.Services.AddScoped<IPropertyType_Repo, PropertyType_Repo>();
            builder.Services.AddScoped<IAmenity_Repo, Amenity_Repo>();
            builder.Services.AddScoped<IPropertyImage_Repo, PropertyImage_Repo>();
            builder.Services.AddScoped<IPropertyAmenity_Repo, PropertyAmenity_Repo>();
            builder.Services.AddScoped<ISavedProperty_Repo, SavedProperty_Repo>();
            builder.Services.AddScoped<IPackage_Repo, Package_Repo>();
            builder.Services.AddScoped<IUserSubscription_Repo, UserSubscription_Repo>();
            builder.Services.AddScoped<IProject_Repo, Project_Repo>();
            builder.Services.AddScoped<IReports_Repo, Reports_Repo>();
            builder.Services.AddScoped<IPropertyReview_Repo, PropertyReview_Repo>();
            builder.Services.AddScoped<INotification_Repo, Notification_Repo>();
            builder.Services.AddScoped<IUserRepo, UserRepo>();

            // Register Unit of Work
            builder.Services.AddScoped<IUnitofwork, Unitofwork>();


            // Configure Identity (without cookies for API)
            builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequiredLength = 6;
                options.User.RequireUniqueEmail = true;
            })
            .AddEntityFrameworkStores<HomyContext>()
            .AddDefaultTokenProviders();

            // Configure JWT Authentication
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                    ),

                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],

                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["Jwt:Audience"],

                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero,

                    // ?? ????? ?????
                    ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha512 }
                };
            });


            // Register Services
            builder.Services.AddScoped<ITokenService, TokenService>();
            
            // Register API Services
            builder.Services.AddScoped<IPropertyApiService, PropertyApiService>();
            builder.Services.AddScoped<IAgentApiService, AgentApiService>();
            builder.Services.AddScoped<ISavedPropertyApiService, SavedPropertyApiService>();
            builder.Services.AddScoped<INotificationApiService, NotificationApiService>();
            builder.Services.AddScoped<IPayPalService, PayPalService>();
            builder.Services.AddScoped<ISubscriptionApiService, SubscriptionApiService>();
            builder.Services.AddScoped<IFileUploadService, FileUploadService>();

            // Register Background Services
            builder.Services.AddHostedService<Homy.api.BackgroundServices.SubscriptionExpiryBackgroundService>();


            // Configure CORS for Angular frontend
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularApp", policy =>
                {
                    policy.WithOrigins("http://localhost:4200") // Angular default port
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                });
            });

            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = Microsoft.OpenApi.Models.ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token."
                });

                options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
                {
                    {
                        new Microsoft.OpenApi.Models.OpenApiSecurityScheme
                        {
                            Reference = new Microsoft.OpenApi.Models.OpenApiReference
                            {
                                Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // Enable static files (for serving uploaded images)
            app.UseStaticFiles();

            // Enable CORS
            app.UseCors("AllowAngularApp");

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            // Seed Roles
            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    await Homy.Infurastructure.Data.RoleSeeder.SeedRolesAsync(services);
                }
                catch (Exception ex)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occurred while seeding roles.");
                }
            }

            app.Run();
        }
    }
}
