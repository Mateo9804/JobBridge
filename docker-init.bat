@echo off
REM Script de inicialización para Docker (Windows)
REM Este script configura Laravel después de levantar los contenedores

echo Inicializando Jobbrige con Docker...
echo.

REM Esperar a que MySQL esté listo
echo ⏳ Esperando a que MySQL esté listo...
timeout /t 10 /nobreak >nul

REM Verificar si el archivo .env existe
if not exist "backend\.env" (
    echo Creando archivo .env desde env.example...
    copy backend\env.example backend\.env
    echo Archivo .env creado. Por favor, revisa y ajusta las variables si es necesario.
)

if not exist "frontend\.env" (
    echo Creando archivo .env del frontend desde env.example...
    copy frontend\env.example frontend\.env
    echo Archivo .env del frontend creado.
)

echo.
echo Configurando Laravel...

REM Generar clave de aplicación
echo Generando clave de aplicación...
docker-compose exec -T backend-php php artisan key:generate

REM Ejecutar migraciones
echo Ejecutando migraciones...
docker-compose exec -T backend-php php artisan migrate --force

REM Ejecutar seeders (cargar datos iniciales como cursos)
echo Cargando datos iniciales (cursos, etc.)...
docker-compose exec -T backend-php php artisan db:seed --force

echo.
echo ¡Configuración completada!
echo.
echo Accede a la aplicación en:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Test: http://localhost:8000/api/test
echo.
echo Para ver los logs: docker-compose logs -f
echo Para detener: docker-compose stop
echo.

pause

