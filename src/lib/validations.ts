import { z } from 'zod'

export const reclamo_schema = z.object({
  reclamo_motivo: z.string().min(1, 'El motivo es requerido').max(500),
  reclamo_motivo_ingles: z.string().max(500).optional(),
  proveedor_id: z.number().int().positive('El proveedor es requerido'),
  reclamo_fecha: z.string().min(1, 'La fecha es requerida'),
  reclamo_artiiculo: z.string().max(20).optional(),
  reclamo_articulo_nombre: z.string().min(1, 'El nombre del artículo es requerido').max(50),
  reclamo_cantidad: z.number().positive('La cantidad debe ser mayor a 0'),
  reclamo_codigo_proveedor: z.string().max(20).optional(),
  reclamo_observaciones: z.string().max(1000).optional(),
  reclamo_observaciones_ingles: z.string().max(1000).optional(),
  reclamo_estado_sircal: z.string().min(1, 'El estado Sircal es requerido'),
  reclamo_estado_proveedor: z.string().min(1, 'El estado del proveedor es requerido'),
  empresa_id: z.number().int().positive('La empresa es requerida'),
  persona_id: z.number().int().positive('La persona es requerida'),
  reclamo_precio_fob: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
})

export type ReclamoFormData = z.infer<typeof reclamo_schema>
