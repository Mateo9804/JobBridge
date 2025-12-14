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

Opción A (simple): SQLite
- Crear el archivo backend/database/database.mysql
- En .env:
  - DB_CONNECTION=sqlite

Después:
php artisan migrate --seed


Opción B: MySQL (XAMPP)
- Crear una DB (ej: jobbridge)
- En .env: DB_CONNECTION=mysql + credenciales
Migrar/seed:

php artisan migrate --seed

3 Correr backend
Opción 1 (recomendada para clonar rápido):

php artisan serve

La API queda en `http://127.0.0.1:8000/api`.

Si vas a correr el frontend en otro host/puerto, ajustá en backend/.env:
- CORS_ALLOWED_ORIGINS=...

Levantar el frontend (React)

1 Instalar dependencias
Desde frontend/:

npm install

2 Configurar URL del backend
- Copiar frontend/env.example a frontend/.env
- Ajustá:
  - REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api (si usás php artisan serve)
  - o http://localhost/jobbrige/backend/public/api (si usás XAMPP/Apache)

Correr frontend

npm start

Nota importante sobre Git
En Git no se deben subir:
- frontend/node_modules/
- backend/vendor/
- archivos .env (secretos)

Este repositori ya tiene .gitignore para eso al clonar hay que poner npm install y composer install.


