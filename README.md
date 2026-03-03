# Sistema de Gestión de Reclamos - NAMI

Sistema completo de ABM (Alta, Baja, Modificación) de reclamos desarrollado con Next.js 14, TypeScript, Material UI y Microsoft SQL Server.

## Características

- **CRUD Completo de Reclamos**: Crear, listar, editar y eliminar reclamos
- **Interfaz moderna** con Material UI (tema azul claro)
- **Paginación** en el listado de reclamos
- **Validación de formularios** con React Hook Form y Zod
- **Reportes**:
  - Resumen general con estadísticas
  - Filtrado por rangos de fechas
  - Agrupación por estados
- **Soporte bilingüe** (Español/Inglés) en campos de texto
- **Convención snake_case** en todo el código

## Tecnologías

- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Material UI v5
  - React Hook Form + Zod
  - date-fns

- **Backend**:
  - Next.js API Routes
  - Microsoft SQL Server (MSSQL)
  - Biblioteca `mssql` para conexión a BD

## Estructura del Proyecto

```
nami-reclamos/
├── src/
│   ├── app/                          # App Router de Next.js
│   │   ├── api/                      # API Routes
│   │   │   ├── reclamos/            # Endpoints de reclamos
│   │   │   │   ├── route.ts         # GET (lista), POST (crear)
│   │   │   │   └── [id]/route.ts    # GET, PUT, DELETE (por ID)
│   │   │   └── reportes/
│   │   │       └── route.ts         # Endpoints de reportes
│   │   ├── reclamos/                # Páginas de reclamos
│   │   │   ├── page.tsx             # Listado
│   │   │   ├── nuevo/page.tsx       # Alta
│   │   │   └── [id]/editar/page.tsx # Modificación
│   │   ├── reportes/
│   │   │   └── page.tsx             # Reportes
│   │   ├── layout.tsx               # Layout principal
│   │   └── page.tsx                 # Página de inicio (redirige a /reclamos)
│   ├── components/                   # Componentes reutilizables
│   │   ├── layout/
│   │   │   ├── app_bar.tsx
│   │   │   └── main_layout.tsx
│   │   ├── reclamos/
│   │   │   ├── reclamo_form.tsx
│   │   │   └── reclamos_list.tsx
│   │   └── theme_provider.tsx
│   ├── lib/                         # Utilidades
│   │   ├── db/
│   │   │   └── connection.ts        # Conexión a MSSQL
│   │   ├── theme.ts                 # Tema de Material UI
│   │   └── validations.ts           # Schemas de Zod
│   └── types/
│       └── reclamo.ts               # Types de TypeScript
├── docs/
│   └── database_schema.md           # Documentación de BD
├── scripts/
│   └── analyze_db.js                # Script de análisis de BD
├── .env.local                       # Variables de entorno
└── package.json
```

## Instalación

1. **Clonar el repositorio** (si aplica) o navegar al directorio del proyecto

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:

   El archivo `.env.local` ya está configurado con las credenciales de la base de datos:
   ```
   DB_SERVER=179.27.97.70
   DB_USER=nasys
   DB_PASSWORD=#sqlAmor0808!
   DB_DATABASE=si_rec
   DB_PORT=1433
   DB_ENCRYPT=false
   DB_TRUST_SERVER_CERTIFICATE=true
   ```

4. **Iniciar el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**:
   ```
   http://localhost:3000
   ```

## Uso

### Listado de Reclamos

- Acceder a `http://localhost:3000/reclamos`
- Visualizar todos los reclamos con paginación
- Usar los iconos de la columna "Acciones" para editar o eliminar
- Clic en "Nuevo Reclamo" para crear uno nuevo

### Crear Reclamo

- Clic en el botón "Nuevo Reclamo"
- Completar el formulario con los datos requeridos:
  - **Motivo** (español e inglés opcional)
  - **Artículo** (nombre y código)
  - **Cantidad**
  - **Precio FOB**
  - **Fecha**
  - **IDs** (Proveedor, Empresa, Persona)
  - **Estados** (Sircal y Proveedor)
  - **Observaciones** (español e inglés opcional)
- Clic en "Guardar"

### Editar Reclamo

- Desde el listado, clic en el ícono de editar (lápiz)
- Modificar los campos deseados
- Clic en "Guardar"

### Eliminar Reclamo

- Desde el listado, clic en el ícono de eliminar (tacho)
- Confirmar la eliminación en el diálogo
- **Nota**: Esta acción es irreversible (DELETE físico en BD)

### Reportes

- Acceder a `http://localhost:3000/reportes`
- **Tab "Resumen General"**:
  - Total de reclamos
  - Distribución por estado Sircal
  - Distribución por estado Proveedor
  - Últimos 10 reclamos
- **Tab "Por Fecha"**:
  - Seleccionar rango de fechas
  - Clic en "Buscar"
  - Visualizar resultados en tabla

## API Endpoints

### Reclamos

- `GET /api/reclamos?page=1&page_size=10` - Listar reclamos (con paginación)
- `POST /api/reclamos` - Crear nuevo reclamo
- `GET /api/reclamos/[id]` - Obtener un reclamo por ID
- `PUT /api/reclamos/[id]` - Actualizar un reclamo
- `DELETE /api/reclamos/[id]` - Eliminar un reclamo

### Reportes

- `GET /api/reportes?tipo=resumen` - Resumen general
- `GET /api/reportes?tipo=por_fecha&fecha_desde=YYYY-MM-DD&fecha_hasta=YYYY-MM-DD` - Por rango de fechas
- `GET /api/reportes?tipo=por_estado` - Agrupado por estado

## Estructura de la Base de Datos

La tabla principal `Reclamo` contiene los siguientes campos:

- **ReclamoId** (PK): ID único del reclamo
- **ReclamoMotivo**: Motivo del reclamo (español)
- **ReclamoMotivoIngles**: Motivo en inglés
- **ProveedorId** (FK): ID del proveedor
- **ReclamoFecha**: Fecha del reclamo
- **ReclamoArtiiculo**: Código del artículo
- **ReclamoArticuloNombre**: Nombre del artículo
- **ReclamoCantidad**: Cantidad reclamada
- **ReclamoEstadoSircal**: Estado interno (Pendiente, En Proceso, Resuelto, Cerrado)
- **ReclamoEstadoProveedor**: Estado del proveedor (Pendiente, Aceptado, Rechazado, En Revision)
- **EmpresaId** (FK): ID de la empresa
- **PersonaId** (FK): ID de la persona
- **ReclamoPrecioFOB**: Precio FOB
- **ReclamoObservaciones**: Observaciones (español)
- **ReclamoObservacionesIngles**: Observaciones en inglés

Ver [docs/database_schema.md](docs/database_schema.md) para más detalles.

## Scripts

### Desarrollo

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run start    # Iniciar servidor de producción
npm run lint     # Ejecutar linter
```

### Análisis de Base de Datos

```bash
node scripts/analyze_db.js  # Analizar estructura de BD
```

## Convenciones de Código

- **Archivos**: `snake_case` (ejemplo: `reclamo_form.tsx`)
- **Componentes React**: `PascalCase` (ejemplo: `ReclamoForm`)
- **Variables y funciones**: `snake_case`
- **Constantes**: `UPPER_SNAKE_CASE`
- **Campos de BD**: `snake_case` en el código (se mapean a PascalCase en BD)

## Notas Importantes

1. **Conexión a BD**: El sistema se conecta a un servidor MSSQL remoto. Asegúrate de tener acceso a la red.

2. **IDs de Referencia**: Actualmente los IDs de Proveedor, Empresa y Persona se ingresan manualmente. En una versión futura, se podrían implementar selects con búsqueda.

3. **Archivos Binarios**: Los campos de factura, video y fotos están en la BD pero no se manejan en esta versión del sistema. Se inicializan como vacíos.

4. **Seguridad**: Este sistema es de acceso libre (sin autenticación). Para producción, se recomienda implementar autenticación y autorización.

5. **Eliminación**: La eliminación de reclamos es física (DELETE). Si se prefiere eliminación lógica, se puede modificar el API route DELETE.

## Próximas Mejoras

- [ ] Autenticación y autorización de usuarios
- [ ] Upload de archivos (facturas, fotos, videos)
- [ ] Selects con autocompletado para Proveedor, Empresa y Persona
- [ ] Exportación de reportes a PDF/Excel
- [ ] Gráficos en reportes
- [ ] Eliminación lógica (soft delete)
- [ ] Búsqueda y filtros avanzados en listado
- [ ] Historial de cambios en reclamos
- [ ] Notificaciones

## Soporte

Para consultas o problemas, contactar al equipo de desarrollo.

---

**Desarrollado con Next.js 14, TypeScript y Material UI**
