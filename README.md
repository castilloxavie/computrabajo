# Computrabajo Scraper

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-21+-40B5A4?style=flat&logo=puppeteer&logoColor=white)](https://pptr.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sequelize](https://img.shields.io/badge/Sequelize-6.37+-52B0E7?style=flat&logo=sequelize&logoColor=white)](https://sequelize.org/)

Un scraper automatizado para extraer y almacenar información de ofertas laborales desde Computrabajo, desarrollado con Node.js, TypeScript y Puppeteer. Utiliza Sequelize para la gestión de una base de datos MySQL, permitiendo un almacenamiento estructurado y eficiente de los datos extraídos.

## 🚀 Características Principales

- **Extracción Automatizada**: Navega por Computrabajo y extrae ofertas de empleo de manera automática.
- **Almacenamiento en Base de Datos**: Guarda los datos en una base de datos MySQL con modelos relacionales para búsquedas, empleos, requisitos y habilidades.
- **Configuración Flexible**: Soporta variables de entorno para personalizar la URL base, credenciales de base de datos y opciones del navegador.
- **Manejo de Fechas**: Convierte fechas relativas (ej. "Hace 7 horas") a formatos estándar para almacenamiento consistente.
- **Modo Depuración**: Ejecuta en modo no headless por defecto para facilitar la depuración visual.
- **Logging Integrado**: Registra búsquedas y operaciones en la consola para seguimiento de procesos.

## 📋 Requisitos del Sistema

- Node.js versión 18 o superior
- MySQL versión 8.0 o superior
- Navegador compatible con Puppeteer (Chrome recomendado)

## 🛠️ Instalación

1. Clona el repositorio:
   ```bash
   git clone <repository-url>
   cd computrabajo-scraper
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura las variables de entorno creando un archivo `.env` en la raíz del proyecto:
   ```env
   COMPUTRABAJO_URL=https://co.computrabajo.com/
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=computrabajo
   ```

4. Asegúrate de que MySQL esté ejecutándose y crea la base de datos especificada.

## 🚀 Uso

Para ejecutar el scraper en modo desarrollo:

```bash
npm run dev
```

Esto iniciará el proceso de scraping:
- Sincroniza la base de datos automáticamente.
- Abre un navegador y navega a Computrabajo.
- Realiza una búsqueda por defecto de "desarrollo Web".
- Extrae información detallada de las ofertas encontradas.
- Almacena los datos en la base de datos MySQL.
- Muestra los resultados en formato JSON en la consola.

Para construir y ejecutar en producción:

```bash
npm run build
npm start
```

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Valor por Defecto |
|----------|-------------|-------------------|
| `COMPUTRABAJO_URL` | URL base de Computrabajo | `https://co.computrabajo.com/` |
| `DB_HOST` | Host de la base de datos MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | (vacío) |
| `DB_NAME` | Nombre de la base de datos | `computrabajo` |

### Opciones del Navegador

El scraper utiliza Puppeteer con las siguientes configuraciones por defecto:
- Modo no headless para depuración visual.
- Ventana maximizada.
- Deshabilitación de notificaciones y aceleración GPU para estabilidad.

Para cambiar a modo headless en producción, modifica `src/config/browser.ts`:
```typescript
export const launchOptions = {
  headless: true, // Cambiar a true para producción
  // ... otras opciones
};
```

## 🗄️ Base de Datos

El proyecto utiliza Sequelize para gestionar una base de datos MySQL con el siguiente esquema:

### Tablas Principales

- **searches**: Almacena términos de búsqueda y su origen.
- **jobs**: Contiene información detallada de cada oferta de empleo.
- **requirements**: Lista los requisitos específicos de cada empleo.
- **skills**: Almacena las habilidades requeridas para cada puesto.

### Sincronización Automática

La base de datos se sincroniza automáticamente al ejecutar el scraper, creando o actualizando tablas según sea necesario.

## 📁 Estructura del Proyecto

```
computrabajo-scraper/
├── src/
│   ├── index.ts                 # Punto de entrada principal
│   ├── computrabajo/
│   │   ├── gestion.ts           # Lógica principal del scraping
│   │   └── db.ts                # Modelos y configuración de Sequelize
│   ├── config/
│   │   ├── browser.ts           # Configuración de Puppeteer
│   │   └── env.ts               # Variables de entorno
│   └── utils/
│       ├── dateParser.ts        # Utilidades para conversión de fechas
│       └── helpers.ts           # Funciones auxiliares
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración de TypeScript
├── .env                         # Variables de entorno (no versionado)
└── README.md                    # Este archivo
```

## 📦 Dependencias

### Principales
- **puppeteer**: Automatización del navegador para scraping.
- **sequelize**: ORM para interacción con MySQL.
- **mysql2**: Driver nativo para MySQL.
- **dotenv**: Carga de variables de entorno.

### Desarrollo
- **typescript**: Lenguaje de programación con tipado estático.
- **tsx**: Ejecutor de TypeScript para desarrollo.
- **@types/node**: Tipos para Node.js.

## 📋 Pautas y Directrices del Proyecto

### Ética y Legalidad
- Este scraper está diseñado para uso educativo y de investigación. Asegúrate de cumplir con los términos de servicio de Computrabajo y las leyes locales sobre scraping de datos.
- Respeta las políticas de robots.txt y limita la frecuencia de solicitudes para evitar sobrecargar los servidores.

### Contribución
1. Fork el repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y asegúrate de que pasen las pruebas.
4. Envía un pull request con una descripción detallada de los cambios.

### Estándares de Código
- Utiliza TypeScript con tipado estricto.
- Sigue las convenciones de nomenclatura camelCase para variables y funciones.
- Mantén la consistencia en el estilo de código (usa Prettier si es posible).
- Documenta funciones complejas con comentarios JSDoc.

### Manejo de Errores
- El scraper incluye manejo básico de errores para fallos en la navegación o extracción.
- Revisa los logs de consola para diagnosticar problemas.
- En caso de errores persistentes, verifica la conectividad a internet y la configuración de MySQL.

### Mejoras Futuras
- Implementar paginación para extraer más ofertas.
- Agregar filtros de búsqueda personalizables.
- Integrar con APIs externas para análisis de datos.
- Desarrollar una interfaz web para visualizar los resultados.

## 📝 Notas Adicionales

- El scraper extrae actualmente ofertas de "desarrollo Web" por defecto. Modifica la variable `busqueda` en `gestion.ts` para cambiar el término de búsqueda.
- Para un rendimiento óptimo, ejecuta en un entorno con buena conectividad y recursos suficientes.
- Monitorea el uso de memoria, ya que Puppeteer puede consumir recursos significativos durante operaciones prolongadas.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo LICENSE para más detalles.

---

Desarrollado por ***Xavier Castillo*** para facilitar la búsqueda y análisis de oportunidades laborales en Computrabajo.
