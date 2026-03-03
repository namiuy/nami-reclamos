export type Proveedor = {
  proveedor_id: number
  proveedor_nombre: string
}

export type ProveedorCreateInput = Omit<Proveedor, 'proveedor_id'>

export type ProveedorUpdateInput = Partial<ProveedorCreateInput>
