#!/bin/sh
set -e

echo "Esperando a PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 1
done

echo "PostgreSQL está listo"
echo "Inicializando base de datos..."
npm run db:init

echo "Iniciando servidor..."
exec npm start
