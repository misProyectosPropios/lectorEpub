FROM node:18-alpine

WORKDIR /app

# Instalar serve globalmente
RUN npm install -g serve

# Copiar archivos del frontend
COPY . .

# Exponer puerto
EXPOSE 3001

# Crear archivo serve.json para redirecciones
# RUN echo '{"rewrites": [{"source": "/books", "destination": "/books.html"}]}' > serve.json

# Comando para servir (sin -s para multi-page app)
CMD ["serve", "-l", "3001"]
