export type Persona = {
  persona_id: number
  persona_nombre: string
}

export type PersonaCreateInput = Omit<Persona, 'persona_id'>

export type PersonaUpdateInput = Partial<PersonaCreateInput>
