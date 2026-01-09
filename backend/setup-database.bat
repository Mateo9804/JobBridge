@echo off
echo ========================================
echo Configuracion de Base de Datos - Jobbrige
echo ========================================
echo.

echo Paso 1: Verificando conexion a MySQL...
mysql -u root -e "SELECT 1" 2>nul
if errorlevel 1 (
    echo ERROR: No se puede conectar a MySQL.
    echo Verifica que MySQL este corriendo en XAMPP.
    pause
    exit /b 1
)
echo OK: Conexion a MySQL exitosa.
echo.

echo Paso 2: Creando base de datos 'jobbrige'...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS jobbrige CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo ERROR: No se pudo crear la base de datos.
    pause
    exit /b 1
)
echo OK: Base de datos creada.
echo.

echo Paso 3: Ejecutando migraciones...
php artisan migrate
if errorlevel 1 (
    echo ERROR: Las migraciones fallaron.
    pause
    exit /b 1
)
echo OK: Migraciones ejecutadas.
echo.

echo Paso 4: Ejecutando seeders (datos de prueba)...
php artisan db:seed
if errorlevel 1 (
    echo ADVERTENCIA: Los seeders fallaron (puede ser normal si ya hay datos).
)
echo.

echo ========================================
echo Configuracion completada!
echo ========================================
echo.
echo La base de datos esta lista para usar.
pause

