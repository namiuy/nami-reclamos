import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()
    const result = await pool.request()
      .input('PersonaId', parseInt(params.id))
      .query(`SELECT PersonaId as persona_id, PersonaNombre as persona_nombre FROM Persona WHERE PersonaId = @PersonaId`)

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 })
    }
    return NextResponse.json(result.recordset[0])
  } catch (error: any) {
    console.error('Error al obtener persona:', error)
    return NextResponse.json({ error: 'Error al obtener persona', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    const check = await pool.request().input('PersonaId', parseInt(params.id)).query('SELECT PersonaId FROM Persona WHERE PersonaId = @PersonaId')
    if (check.recordset.length === 0) return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 })

    await pool.request()
      .input('PersonaId', parseInt(params.id))
      .input('PersonaNombre', body.persona_nombre)
      .query(`UPDATE Persona SET PersonaNombre = @PersonaNombre WHERE PersonaId = @PersonaId`)

    return NextResponse.json({ message: 'Persona actualizada exitosamente' })
  } catch (error: any) {
    console.error('Error al actualizar persona:', error)
    return NextResponse.json({ error: 'Error al actualizar persona', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()

    const check = await pool.request().input('PersonaId', parseInt(params.id)).query('SELECT PersonaId FROM Persona WHERE PersonaId = @PersonaId')
    if (check.recordset.length === 0) return NextResponse.json({ error: 'Persona no encontrada' }, { status: 404 })

    await pool.request().input('PersonaId', parseInt(params.id)).query('DELETE FROM Persona WHERE PersonaId = @PersonaId')
    return NextResponse.json({ message: 'Persona eliminada exitosamente' })
  } catch (error: any) {
    console.error('Error al eliminar persona:', error)
    return NextResponse.json({ error: 'Error al eliminar persona', details: error.message }, { status: 500 })
  }
}
