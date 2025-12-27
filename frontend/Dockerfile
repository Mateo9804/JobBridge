FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de package
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos
COPY . .

# Exponer puerto
EXPOSE 3000

# Comando para desarrollo (puede cambiarse a build para producción)
CMD ["npm", "start"]

