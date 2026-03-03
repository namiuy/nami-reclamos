export type Empresa = {
  empresa_id: number
  empresa_nombre: string
}

export type EmpresaCreateInput = Omit<Empresa, 'empresa_id'>

export type EmpresaUpdateInput = Partial<EmpresaCreateInput>
