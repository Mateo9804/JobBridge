# JobBridge

Plataforma web para conectar profesionales con oportunidades laborales. Aplicación full-stack desarrollada con React y Laravel que permite a empresas publicar ofertas de trabajo y a usuarios buscar y aplicar a empleos.

🌐 **Versión en línea:** [https://job-bridge-alpha.vercel.app/](https://job-bridge-alpha.vercel.app/)

## ¿Para qué sirve?

JobBridge facilita el proceso de búsqueda y publicación de empleos mediante:

- **Búsqueda avanzada** de ofertas con filtros por categoría, experiencia, ubicación y habilidades
- **Panel de empresas** para gestionar ofertas de trabajo y recibir aplicaciones
- **Sistema de aplicaciones** para postularse a múltiples empleos
- **Perfiles de usuario** con constructor de CV integrado
- **Cursos formativos** para mejorar habilidades profesionales
- **Sistema de notificaciones** para mantener a usuarios y empresas informados

## ¿Cómo se ejecuta?

### Versión en línea

Puedes probar la aplicación directamente en línea sin necesidad de instalación:

🔗 **[https://job-bridge-alpha.vercel.app/](https://job-bridge-alpha.vercel.app/)**

### Instalación local

Si prefieres ejecutarlo localmente, sigue estos pasos:

#### Requisitos

- PHP >= 8.2
- Composer
- Node.js >= 16
- MySQL/MariaDB
- XAMPP (recomendado) o servidor web con Apache

#### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/Mateo9804/JobBridge.git
   cd jobbrige
   ```

2. **Backend (Laravel)**
   ```bash
   cd backend
   composer install
   ```
   
   Configurar `.env`:
   - Copiar `backend/.env.example` a `backend/.env`
   - Configurar base de datos:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=jobbrige
     DB_USERNAME=root
     DB_PASSWORD=
     ```
   - Generar clave de aplicación:
     ```bash
     php artisan key:generate
     ```
   
   Ejecutar migraciones:
   ```bash
   php artisan migrate
   ```

3. **Frontend (React)**
   ```bash
   cd frontend
   npm install
   ```
   
   Configurar URL del backend en `frontend/.env`:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080/jobbrige/backend/public/api
   ```
   
   O usar el script de configuración:
   ```bash
   node setup-env.js xampp8080
   ```

#### Ejecución

**Backend:**
- Con XAMPP: Acceder a `http://localhost:8080/jobbrige/backend/public`
- Con artisan: `php artisan serve` (API en `http://127.0.0.1:8000/api`)

**Frontend:**
```bash
cd frontend
npm start
```
La aplicación estará disponible en `http://localhost:3000`

## Estado del proyecto

Proyecto en desarrollo activo. Versión inicial funcional con las características principales implementadas.

## Tecnologías

- **Frontend:** React, React Router, CSS3
- **Backend:** Laravel 11, MySQL, Sanctum (autenticación)
- **Herramientas:** Composer, npm, Git

## Estructura del proyecto

```
jobbrige/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── config/        # Configuración (API endpoints)
│   │   └── context/       # Context API (autenticación)
│   └── public/
├── backend/           # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Services/
│   ├── database/migrations/
│   └── routes/api.php
└── README.md
```

## Autor

Mateo9804 - [GitHub](https://github.com/Mateo9804)
