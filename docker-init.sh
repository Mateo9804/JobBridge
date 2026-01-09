echo "Inicializando Jobbrige con Docker..."
echo ""

echo "Esperando a que MySQL esté listo..."
sleep 10

if [ ! -f "backend/.env" ]; then
    echo "Creando archivo .env desde env.example..."
    cp backend/env.example backend/.env
    echo "Archivo .env creado. Por favor, revisa y ajusta las variables si es necesario."
fi

if [ ! -f "frontend/.env" ]; then
    echo "Creando archivo .env del frontend desde env.example..."
    cp frontend/env.example frontend/.env
    echo "Archivo .env del frontend creado."
fi

echo ""
echo "Configurando Laravel..."

echo "Generando clave de aplicación..."
docker-compose exec -T backend-php php artisan key:generate

echo "Ejecutando migraciones..."
docker-compose exec -T backend-php php artisan migrate --force

echo "Cargando datos iniciales (cursos, etc.)..."
docker-compose exec -T backend-php php artisan db:seed --force

echo ""
echo "¡Configuración completada!"
echo ""
echo "Accede a la aplicación en:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Test: http://localhost:8000/api/test"
echo ""
echo "Para ver los logs: docker-compose logs -f"
echo "Para detener: docker-compose stop"
echo ""

