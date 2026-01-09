#!/bin/bash
# No usar set -e para que el script continúe aunque haya errores menores

echo "=== Iniciando JobBridge Backend ==="

# Esperar a que la base de datos esté lista (si es necesario)
if [ -n "$DB_HOST" ] && [ -n "$DB_DATABASE" ]; then
  echo "Esperando a la base de datos..."
  max_attempts=30
  attempt=0
  while [ $attempt -lt $max_attempts ]; do
    if php -r "try { new PDO('mysql:host=$DB_HOST;port=${DB_PORT:-3306};dbname=$DB_DATABASE', '$DB_USERNAME', '$DB_PASSWORD'); exit(0); } catch (Exception \$e) { exit(1); }" 2>/dev/null; then
      echo "Base de datos lista!"
      break
    fi
    attempt=$((attempt + 1))
    echo "Intento $attempt/$max_attempts - Esperando a la base de datos..."
    sleep 2
  done
  if [ $attempt -eq $max_attempts ]; then
    echo "ADVERTENCIA: No se pudo conectar a la base de datos después de $max_attempts intentos"
  fi
else
  echo "ADVERTENCIA: Variables de base de datos no configuradas"
fi

# Generar APP_KEY si no existe
if [ -z "$APP_KEY" ]; then
  echo "Generando APP_KEY..."
  php artisan key:generate --force || echo "ADVERTENCIA: No se pudo generar APP_KEY"
fi

# Limpiar cache (ignorar errores)
echo "Limpiando cache..."
php artisan config:clear || true
php artisan cache:clear || true
php artisan route:clear || true
php artisan view:clear || true

# Optimizar para producción (ignorar errores si falla)
echo "Optimizando para producción..."
php artisan config:cache || echo "ADVERTENCIA: No se pudo cachear config"
php artisan route:cache || echo "ADVERTENCIA: No se pudo cachear rutas"
php artisan view:cache || echo "ADVERTENCIA: No se pudo cachear vistas"

# Ejecutar migraciones (solo si no se ha hecho antes)
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "Ejecutando migraciones..."
  php artisan migrate --force || echo "ADVERTENCIA: Error al ejecutar migraciones"
fi

# Configurar permisos
echo "Configurando permisos..."
chown -R www-data:www-data /var/www/html/storage || true
chown -R www-data:www-data /var/www/html/bootstrap/cache || true
chmod -R 755 /var/www/html/storage || true
chmod -R 755 /var/www/html/bootstrap/cache || true

echo "=== Iniciando Supervisor ==="
# Iniciar Supervisor (esto debe ser el último comando y no debe fallar)
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf

