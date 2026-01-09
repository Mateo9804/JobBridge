# Script de inicialización para Docker (PowerShell)
# Este script configura Laravel después de levantar los contenedores

Write-Host "Inicializando Jobbrige con Docker..." -ForegroundColor Cyan
Write-Host ""

# Esperar a que MySQL esté listo
Write-Host "⏳ Esperando a que MySQL esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Verificar si el archivo .env existe
if (-not (Test-Path "backend\.env")) {
    Write-Host "Creando archivo .env desde env.example..." -ForegroundColor Yellow
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "Archivo .env creado. Por favor, revisa y ajusta las variables si es necesario." -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Write-Host "Creando archivo .env del frontend desde env.example..." -ForegroundColor Yellow
    Copy-Item "frontend\env.example" "frontend\.env"
    Write-Host "Archivo .env del frontend creado." -ForegroundColor Green
}

Write-Host ""
Write-Host "Configurando Laravel..." -ForegroundColor Cyan

# Generar clave de aplicación
Write-Host "Generando clave de aplicación..." -ForegroundColor Yellow
docker-compose exec -T backend-php php artisan key:generate

# Ejecutar migraciones
Write-Host "Ejecutando migraciones..." -ForegroundColor Yellow
docker-compose exec -T backend-php php artisan migrate --force

# Ejecutar seeders (cargar datos iniciales como cursos)
Write-Host "Cargando datos iniciales (cursos, etc.)..." -ForegroundColor Yellow
docker-compose exec -T backend-php php artisan db:seed --force

Write-Host ""
Write-Host "¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Accede a la aplicación en:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   - Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   - API Test: http://localhost:8000/api/test" -ForegroundColor White
Write-Host ""
Write-Host "Para ver los logs: docker-compose logs -f" -ForegroundColor Gray
Write-Host "Para detener: docker-compose stop" -ForegroundColor Gray
Write-Host ""

Read-Host "Presiona Enter para continuar"

