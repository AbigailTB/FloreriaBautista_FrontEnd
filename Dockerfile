# ─── Imagen base ───────────────────────────────────────────────
FROM node:22-alpine
 
# Directorio de trabajo
WORKDIR /app
 
# Copiar dependencias primero (cache de capas)
COPY package*.json ./
 
# Instalar todas las dependencias (incluye devDependencies para Vite)
RUN npm install
 
# Copiar el resto del código
COPY . .
 
# Exponer el puerto de Vite
EXPOSE 5173
 
# Iniciar en modo desarrollo con host 0.0.0.0
# para que sea accesible desde fuera del contenedor
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "5173"]
