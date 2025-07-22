
using Pinterest.Api.Configurations;
using Pinterest.Api.Endpoints;
using Pinterest.Api.Extensions;

namespace Pinterest.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.ConfigureDataBase();
            builder.ConfigurationJwtAuth();
            builder.ConfigureJwtSettings();
            builder.ConfigureSerilog();
            builder.Services.ConfigureDependecies();

            ServiceCollectionExtensions.AddSwaggerWithJwt(builder.Services);

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.MapAuthEndpoints();
            app.MapRoleEndpoints();

            app.MapControllers();

            app.Run();
        }
    }
}
