# Diplomado React Proyecto

Aplicacion desarrollada en React + TypeScript para la gestion de tareas.

## Nombre:

**Paola Valeria Burgos Pomacusi**

## Instalacion

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/valitab/diplomado-react-proyecto.git
   ```
2. Ingresar al proyecto:
   ```bash
   cd diplomado-react-proyecto
   ```
3. Instalar dependencias:
   ```bash
   npm install
   ```

## Ejecucion local

1. Crear archivo `.env` (puedes usar `.env.sample` como base).
2. Configurar variable:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Deploy en GitHub Pages

1. Configurar el archivo `.env.production`:
   ```env
   VITE_API_URL=https://taskdone-node.onrender.com/api
   ```
2. Generar build de produccion:
   ```bash
   npm run build
   ```
3. Publicar en GitHub Pages:
   ```bash
   npm run deploy
   ```
4. Verificar en GitHub: `Settings > Pages` con rama `gh-pages` y carpeta `/ (root)`.

## Enlace de la aplicacion

[https://valitab.github.io/diplomado-react-proyecto/](https://valitab.github.io/diplomado-react-proyecto/)
