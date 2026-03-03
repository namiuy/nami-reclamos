# Estructura de Base de Datos - Sistema de Reclamos

## Tabla Principal: Reclamo

### Columnas

| Columna | Tipo | Requerido | Descripción |
|---------|------|-----------|-------------|
| ReclamoId | int | NOT NULL | ID único del reclamo (PK) |
| ReclamoMotivo | varchar(500) | NOT NULL | Motivo del reclamo (español) |
| ReclamoFactura | varbinary(-1) | NOT NULL | Archivo de factura (binario) |
| ReclamoFactura_GXI | varchar(2048) | NULL | Información adicional de factura |
| ProveedorId | int | NOT NULL | ID del proveedor (FK) |
| ReclamoFecha | datetime | NOT NULL | Fecha del reclamo |
| ReclamoArtiiculo | varchar(20) | NOT NULL | Código del artículo |
| ReclamoArticuloNombre | varchar(50) | NOT NULL | Nombre del artículo |
| ReclamoCantidad | money | NOT NULL | Cantidad reclamada |
| ReclamoCodigoProveedor | varchar(20) | NOT NULL | Código del proveedor |
| ReclamoObservaciones | varchar(1000) | NOT NULL | Observaciones (español) |
| ReclamoEstadoSircal | varchar(12) | NOT NULL | Estado interno (Sircal) |
| ReclamoEstadoProveedor | varchar(12) | NOT NULL | Estado del proveedor |
| EmpresaId | int | NOT NULL | ID de la empresa (FK) |
| PersonaId | int | NOT NULL | ID de la persona (FK) |
| ReclamoPrecioFOB | money | NOT NULL | Precio FOB |
| ReclamoMotivoIngles | varchar(500) | NOT NULL | Motivo del reclamo (inglés) |
| ReclamoObservacionesIngles | varchar(1000) | NOT NULL | Observaciones (inglés) |
| ReclamoVideo | varbinary(-1) | NOT NULL | Video del reclamo (binario) |
| ReclamoVideo_GXI | varchar(2048) | NOT NULL | Información adicional del video |
| ReclamoFotoIdUltima | smallint | NOT NULL | ID de la última foto |

### Relaciones (Foreign Keys)

- **ProveedorId** → Proveedor(ProveedorId)
- **EmpresaId** → Empresa(EmpresaId)
- **PersonaId** → Persona(PersonaId)

### Primary Key

- ReclamoId

---

## Tabla Relacionada: ReclamoReclamoFotos

Tabla para múltiples fotos por reclamo.

### Columnas

| Columna | Tipo | Requerido | Descripción |
|---------|------|-----------|-------------|
| ReclamoId | int | NOT NULL | ID del reclamo (PK, FK) |
| ReclamoFotoId | int | NOT NULL | ID de la foto (PK) |
| ReclamoFoto | varbinary(-1) | NOT NULL | Foto (binario) |
| ReclamoFoto_GXI | varchar(2048) | NULL | Información adicional de foto |

### Relaciones

- **ReclamoId** → Reclamo(ReclamoId)

### Primary Key

- ReclamoFotoId, ReclamoId

---

## Estados Posibles

### ReclamoEstadoSircal
Estados internos (varchar(12)):
- Pendiente
- En Proceso
- Resuelto
- Cerrado
- (a confirmar valores exactos)

### ReclamoEstadoProveedor
Estados del proveedor (varchar(12)):
- (a definir valores posibles)

---

## Notas Técnicas

- Base de datos: **Microsoft SQL Server (MSSQL)**
- Server: 179.27.97.70
- Puerto: 1433
- Base de datos: si_rec
- Los campos de tipo `money` se usan para valores monetarios
- Los campos `varbinary(-1)` almacenan archivos binarios (facturas, videos, fotos)
- Los campos `_GXI` parecen ser metadatos de archivos (generados por GeneXus)
- Hay soporte bilingüe (español/inglés) en motivo y observaciones
