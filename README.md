## Jobbrige (frontend + backend)

Este repo tiene:
- **`frontend/`**: React (Create React App)
- **`backend/`**: Laravel (API)

### Requisitos
- **PHP 8.2+** y **Composer**
- **Node.js 18+**
- (Opcional) **XAMPP** si querés correr el backend en Apache/MySQL

---

## Levantar el backend (Laravel)

### 1) Instalar dependencias
Desde `backend/`:

```bash
composer install
```

### 2) Configurar `.env`
- Copiá `backend/env.example` a `backend/.env`
- Seteá `APP_KEY` y DB:

```bash
php artisan key:generate
```

#### Opción A (simple): SQLite
- Crear el archivo `backend/database/database.sqlite`
- En `.env`:
  - `DB_CONNECTION=sqlite`

Luego:

```bash
php artisan migrate --seed
```

#### Opción B: MySQL (XAMPP)
- Crear una DB (ej: `jobbrige`)
- En `.env`: `DB_CONNECTION=mysql` + credenciales
- Migrar/seed:

```bash
php artisan migrate --seed
```

### 3) Correr backend
Opción 1 (recomendada para clonar rápido):

```bash
php artisan serve
```

La API queda en `http://127.0.0.1:8000/api`.

Si vas a correr el frontend en otro host/puerto, ajustá en `backend/.env`:
- `CORS_ALLOWED_ORIGINS=...` (coma separado)

---

## Levantar el frontend (React)

### 1) Instalar dependencias
Desde `frontend/`:

```bash
npm install
```

### 2) Configurar URL del backend
- Copiá `frontend/env.example` a `frontend/.env`
- Ajustá:
  - `REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api` (si usás `php artisan serve`)
  - o `http://localhost/jobbrige/backend/public/api` (si usás XAMPP/Apache)

### 3) Correr frontend

```bash
npm start
```

---

## Nota importante sobre Git
En Git **NO** se deben subir:
- `frontend/node_modules/`
- `backend/vendor/`
- archivos `.env` (secretos)

Este repo ya tiene `.gitignore` para eso; al clonar hay que correr `npm install` y `composer install`.


