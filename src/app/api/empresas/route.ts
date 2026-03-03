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
      SELECT EmpresaId as empresa_id, EmpresaNombre as empresa_nombre
      FROM Empresa
      ORDER BY EmpresaNombre ASC
      OFFSET ${offset} ROWS FETCH NEXT ${page_size} ROWS ONLY
    `)

    const count_result = await pool.request().query(`SELECT COUNT(*) as total FROM Empresa`)
    const total = count_result.recordset[0].total

    return NextResponse.json({
      data: result.recordset,
      pagination: { page, page_size, total, total_pages: Math.ceil(total / page_size) },
    })
  } catch (error: any) {
    console.error('Error al obtener empresas:', error)
    return NextResponse.json({ error: 'Error al obtener empresas', details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    const result = await pool.request()
      .input('EmpresaNombre', body.empresa_nombre)
      .query(`INSERT INTO Empresa (EmpresaNombre) VALUES (@EmpresaNombre); SELECT SCOPE_IDENTITY() as empresa_id;`)

    return NextResponse.json(
      { message: 'Empresa creada exitosamente', empresa_id: result.recordset[0].empresa_id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error al crear empresa:', error)
    return NextResponse.json({ error: 'Error al crear empresa', details: error.message }, { status: 500 })
  }
}
