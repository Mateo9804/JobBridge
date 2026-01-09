#!/usr/bin/env node

/**
 * Script helper para configurar el .env del frontend según el entorno
 * 
 * Uso:
 *   node setup-env.js xampp    - Para XAMPP/Apache
 *   node setup-env.js docker   - Para Docker
 *   node setup-env.js artisan  - Para Laravel artisan serve
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

const configs = {
  xampp: {
    url: 'http://localhost/jobbrige/backend/public/api',
    description: 'XAMPP / Apache (puerto 80)'
  },
  xampp8080: {
    url: 'http://localhost:8080/jobbrige/backend/public/api',
    description: 'XAMPP / Apache (puerto 8080)'
  },
  docker: {
    url: 'http://localhost:8000/api',
    description: 'Docker'
  },
  artisan: {
    url: 'http://127.0.0.1:8000/api',
    description: 'Laravel artisan serve'
  }
};

const environment = process.argv[2] || 'xampp8080';

if (!configs[environment]) {
  console.error(`❌ Entorno desconocido: ${environment}`);
  console.log('\nEntornos disponibles:');
  Object.keys(configs).forEach(key => {
    console.log(`  - ${key}: ${configs[key].description}`);
  });
  process.exit(1);
}

const config = configs[environment];
const envContent = `## Frontend Environment Configuration
## Configurado para: ${config.description}
## Generado automáticamente por setup-env.js

REACT_APP_API_BASE_URL=${config.url}
`;

try {
  fs.writeFileSync(envPath, envContent, 'utf8');
  console.log(`✅ Archivo .env configurado para: ${config.description}`);
  console.log(`   URL: ${config.url}`);
  console.log('\n⚠️  Reinicia el servidor de desarrollo (npm start) para aplicar los cambios.');
} catch (error) {
  console.error(`❌ Error al escribir el archivo .env:`, error.message);
  process.exit(1);
}

