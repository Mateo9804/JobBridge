Jobbrige (frontend + backend)

Este repositorio tiene:
frontend: React (Create React App)
backend: Laravel (API)

1 Instalar dependencias
Desde backend:

bash
composer install

Configurar .env
- Copiar backend/env.example a backend/.env
- Setear APP_KEY y DB:

bash
php artisan key:generate

- Crear una DB (ej: jobbridge)
- En .env: DB_CONNECTION=mysql + credenciales
Migrar/seed:

php artisan migrate --seed

3 Correr backend

php artisan serve

La API queda en http://127.0.0.1:8000/api

Levantar el frontend (React)

1 Instalar dependencias
Desde frontend/:

npm install

2 Configurar URL del backend

Correr frontend

npm start

Este repositorio ya tiene .gitignore para eso al clonar hay que poner npm install y composer install.


