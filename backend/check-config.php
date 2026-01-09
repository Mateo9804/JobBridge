<?php
/**
 * Script de diagnóstico para verificar la configuración del backend
 * Accede desde: http://localhost:8080/jobbrige/backend/public/check-config.php
 */

// Mostrar errores
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Diagnóstico de Configuración - Jobbrige Backend</h1>";

// 1. Verificar PHP
echo "<h2>1. Versión de PHP</h2>";
echo "Versión: " . phpversion() . "<br>";
echo "Requisito: >= 8.2<br>";
echo phpversion() >= '8.2' ? "✅ OK" : "❌ ERROR: Se requiere PHP 8.2 o superior";

// 2. Verificar extensiones
echo "<h2>2. Extensiones PHP Requeridas</h2>";
$required = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'json', 'fileinfo'];
foreach ($required as $ext) {
    $loaded = extension_loaded($ext);
    echo $ext . ": " . ($loaded ? "✅ Cargada" : "❌ NO cargada") . "<br>";
}

// 3. Verificar .env
echo "<h2>3. Archivo .env</h2>";
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    echo "✅ Archivo .env existe<br>";
    $env = parse_ini_file($envPath);
    echo "APP_ENV: " . ($env['APP_ENV'] ?? 'NO DEFINIDO') . "<br>";
    echo "APP_DEBUG: " . ($env['APP_DEBUG'] ?? 'NO DEFINIDO') . "<br>";
    echo "DB_CONNECTION: " . ($env['DB_CONNECTION'] ?? 'NO DEFINIDO') . "<br>";
} else {
    echo "❌ Archivo .env NO existe<br>";
}

// 4. Verificar conexión a BD
echo "<h2>4. Conexión a Base de Datos</h2>";
if (file_exists($envPath)) {
    $env = parse_ini_file($envPath);
    try {
        $host = $env['DB_HOST'] ?? '127.0.0.1';
        $port = $env['DB_PORT'] ?? '3306';
        $database = $env['DB_DATABASE'] ?? '';
        $username = $env['DB_USERNAME'] ?? 'root';
        $password = $env['DB_PASSWORD'] ?? '';
        
        $dsn = "mysql:host=$host;port=$port;dbname=$database;charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "✅ Conexión a base de datos exitosa<br>";
        echo "Base de datos: $database<br>";
    } catch (PDOException $e) {
        echo "❌ Error de conexión: " . $e->getMessage() . "<br>";
    }
} else {
    echo "⚠️ No se puede verificar (falta .env)<br>";
}

// 5. Verificar permisos de storage
echo "<h2>5. Permisos de Storage</h2>";
$storagePath = __DIR__ . '/../storage';
$logsPath = $storagePath . '/logs';
if (is_writable($storagePath)) {
    echo "✅ Storage es escribible<br>";
} else {
    echo "❌ Storage NO es escribible<br>";
}

if (is_writable($logsPath)) {
    echo "✅ Logs es escribible<br>";
} else {
    echo "❌ Logs NO es escribible<br>";
}

// 6. Verificar rutas
echo "<h2>6. Rutas de API</h2>";
echo "URL base esperada: http://localhost:8080/jobbrige/backend/public/<br>";
echo "Ruta de API: http://localhost:8080/jobbrige/backend/public/api/<br>";
echo "Ruta de test: <a href='api/test' target='_blank'>api/test</a><br>";

// 7. Verificar autoload
echo "<h2>7. Autoload de Composer</h2>";
$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (file_exists($autoloadPath)) {
    echo "✅ vendor/autoload.php existe<br>";
    require_once $autoloadPath;
    echo "✅ Autoload cargado<br>";
} else {
    echo "❌ vendor/autoload.php NO existe. Ejecuta: composer install<br>";
}

echo "<hr>";
echo "<p><strong>Si todo está OK, el problema puede estar en:</strong></p>";
echo "<ul>";
echo "<li>Configuración de CORS</li>";
echo "<li>Middleware de autenticación</li>";
echo "<li>Rutas mal configuradas</li>";
echo "</ul>";

