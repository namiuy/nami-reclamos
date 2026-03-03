import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

export async function GET(request: NextRequest) {
  try {
    const pool = await get_database_pool()
    const search_params = request.nextUrl.searchParams
    const page = parseInt(search_params.get('page') || '1')
    const page_size = parseInt(search_params.get('page_size') || '10')
    const offset = (page - 1) * page_size

    const result = await pool.request().query(`
      SELECT PersonaId as persona_id, PersonaNombre as persona_nombre
      FROM Persona
      ORDER BY PersonaNombre ASC
      OFFSET ${offset} ROWS FETCH NEXT ${page_size} ROWS ONLY
    `)

    const count_result = await pool.request().query(`SELECT COUNT(*) as total FROM Persona`)
    const total = count_result.recordset[0].total

    return NextResponse.json({
      data: result.recordset,
      pagination: { page, page_size, total, total_pages: Math.ceil(total / page_size) },
    })
  } catch (error: any) {
    console.error('Error al obtener personas:', error)
    return NextResponse.json({ error: 'Error al obtener personas', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    const result = await pool.request()
      .input('PersonaNombre', body.persona_nombre)
      .query(`INSERT INTO Persona (PersonaNombre) VALUES (@PersonaNombre); SELECT SCOPE_IDENTITY() as persona_id;`)

    return NextResponse.json(
      { message: 'Persona creada exitosamente', persona_id: result.recordset[0].persona_id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error al crear persona:', error)
    return NextResponse.json({ error: 'Error al crear persona', details: error.message }, { status: 500 })
  }
}
