var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Servicios
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
builder.Services.AddCarter();

builder.Services.AddMarten(opts =>
{
    opts.Connection(builder.Configuration.GetConnectionString("Database")!);
}).UseLightweightSessions();

// 🟢 CONFIGURACIÓN DE CORS (Agregado)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 🟢 ACTIVAR MIDDLEWARE DE CORS (Agregado - Debe ir ANTES de MapCarter)
app.UseCors("AllowAll");

// Utilizamos Carter como parte de minimal api
app.MapCarter();

app.Run();