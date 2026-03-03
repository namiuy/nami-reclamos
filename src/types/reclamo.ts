export type Reclamo = {
  reclamo_id: number
  reclamo_motivo: string
  reclamo_factura?: Buffer | null
  reclamo_factura_gxi?: string | null
  proveedor_id: number
  reclamo_fecha: Date
  reclamo_artiiculo: string
  reclamo_articulo_nombre: string
  reclamo_cantidad: number
  reclamo_codigo_proveedor: string
  reclamo_observaciones: string
  reclamo_estado_sircal: string
  reclamo_estado_proveedor: string
  empresa_id: number
  persona_id: number
  reclamo_precio_fob: number
  reclamo_motivo_ingles: string
  reclamo_observaciones_ingles: string
  reclamo_video?: Buffer | null
  reclamo_video_gxi: string
  reclamo_foto_id_ultima: number
}

export type ReclamoCreateInput = Omit<Reclamo, 'reclamo_id'>

export type ReclamoUpdateInput = Partial<ReclamoCreateInput>

export type ReclamoListItem = Pick<
  Reclamo,
  | 'reclamo_id'
  | 'reclamo_fecha'
  | 'reclamo_motivo'
  | 'reclamo_articulo_nombre'
  | 'reclamo_cantidad'
  | 'reclamo_estado_sircal'
  | 'reclamo_estado_proveedor'
  | 'proveedor_id'
>

export type ReclamoFoto = {
  reclamo_id: number
  reclamo_foto_id: number
  reclamo_foto: Buffer
  reclamo_foto_gxi?: string | null
}

export const ESTADOS_SIRCAL = [
  'Pendiente',
  'En Proceso',
  'Resuelto',
  'Cerrado',
] as const

export const ESTADOS_PROVEEDOR = [
  'Pendiente',
  'Aceptado',
  'Rechazado',
  'En Revision',
] as const

export type EstadoSircal = (typeof ESTADOS_SIRCAL)[number]
export type EstadoProveedor = (typeof ESTADOS_PROVEEDOR)[number]
