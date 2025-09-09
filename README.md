# Computrabajo Scraper

Proyecto de automatización y extracción de información de Computrabajo usando Node.js, TypeScript y Puppeteer.

## Instalación

```bash
npm install
```

## Uso

Para ejecutar el scraper:

```bash
npm run dev
```

Esto lanzará el navegador, navegará a Computrabajo, extraerá información de empleos y la mostrará en formato JSON.

## Estructura del Proyecto

- `src/index.ts`: Archivo principal con la lógica del scraper
- `package.json`: Configuración del proyecto y dependencias
- `tsconfig.json`: Configuración de TypeScript
- `.gitignore`: Archivos ignorados por Git

## Dependencias

- Puppeteer: Para automatización del navegador
- TypeScript: Para tipado estático
- ts-node: Para ejecutar TypeScript directamente

## Notas

- El scraper está configurado para modo no headless por defecto para depuración.
- Cambia `headless: false` a `true` en producción.
