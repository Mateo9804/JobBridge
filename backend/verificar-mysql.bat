@echo off
echo ========================================
echo Verificacion de MySQL - Jobbrige
echo ========================================
echo.

echo Paso 1: Verificando si MySQL esta corriendo...
mysql -u root -e "SELECT 1" 2>nul
if errorlevel 1 (
    echo.
    echo ERROR: MySQL no esta corriendo o no se puede conectar.
    echo.
    echo SOLUCION:
    echo 1. Abre el Panel de Control de XAMPP
    echo 2. Inicia el servicio MySQL (boton Start)
    echo 3. Verifica que el puerto 3306 este disponible
    echo.
    pause
    exit /b 1
)
echo OK: MySQL esta corriendo.
echo.

echo Paso 2: Verificando base de datos 'jobbrige'...
mysql -u root -e "USE jobbrige;" 2>nul
if errorlevel 1 (
    echo La base de datos 'jobbrige' no existe.
    echo.
    echo Creando base de datos...
    mysql -u root -e "CREATE DATABASE IF NOT EXISTS jobbrige CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if errorlevel 1 (
        echo ERROR: No se pudo crear la base de datos.
        pause
        exit /b 1
    )
    echo OK: Base de datos 'jobbrige' creada.
) else (
    echo OK: Base de datos 'jobbrige' existe.
)
echo.

echo Paso 3: Verificando configuracion en .env...
if not exist ".env" (
    echo ADVERTENCIA: El archivo .env no existe.
    echo Copia .env.example a .env y configura la base de datos.
) else (
    echo OK: Archivo .env existe.
    findstr /C:"DB_DATABASE" .env
)
echo.

echo ========================================
echo Verificacion completada!
echo ========================================
echo.
pause

