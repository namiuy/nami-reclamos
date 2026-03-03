import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

// GET /api/proveedores - Obtener lista de proveedores
export async function GET(request: NextRequest) {
  try {
    const pool = await get_database_pool()

    const search_params = request.nextUrl.searchParams
    const page = parseInt(search_params.get('page') || '1')
    const page_size = parseInt(search_params.get('page_size') || '10')
    const offset = (page - 1) * page_size

    const result = await pool.request().query(`
      SELECT
        ProveedorId as proveedor_id,
        ProveedorNombre as proveedor_nombre
      FROM Proveedor
      ORDER BY ProveedorNombre ASC
      OFFSET ${offset} ROWS
      FETCH NEXT ${page_size} ROWS ONLY
    `)

    const count_result = await pool.request().query(`
      SELECT COUNT(*) as total FROM Proveedor
    `)

    const total = count_result.recordset[0].total

    return NextResponse.json({
      data: result.recordset,
      pagination: {
        page,
        page_size,
        total,
        total_pages: Math.ceil(total / page_size),
      },
    })
  } catch (error: any) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json(
      { error: 'Error al obtener proveedores', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/proveedores - Crear nuevo proveedor
export async function POST(request: NextRequest) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    const result = await pool.request()
      .input('ProveedorNombre', body.proveedor_nombre)
      .query(`
        INSERT INTO Proveedor (ProveedorNombre)
        VALUES (@ProveedorNombre);
        SELECT SCOPE_IDENTITY() as proveedor_id;
      `)

    const new_proveedor_id = result.recordset[0].proveedor_id

    return NextResponse.json(
      { message: 'Proveedor creado exitosamente', proveedor_id: new_proveedor_id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error al crear proveedor:', error)
    return NextResponse.json(
      { error: 'Error al crear proveedor', details: error.message },
      { status: 500 }
    )
  }
}
