import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

// GET /api/proveedores/[id] - Obtener un proveedor por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const proveedor_id = parseInt(params.id)

    const result = await pool.request()
      .input('ProveedorId', proveedor_id)
      .query(`
        SELECT
          ProveedorId as proveedor_id,
          ProveedorNombre as proveedor_nombre
        FROM Proveedor
        WHERE ProveedorId = @ProveedorId
      `)

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.recordset[0])
  } catch (error: any) {
    console.error('Error al obtener proveedor:', error)
    return NextResponse.json(
      { error: 'Error al obtener proveedor', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/proveedores/[id] - Actualizar un proveedor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const proveedor_id = parseInt(params.id)
    const body = await request.json()

    const check_result = await pool.request()
      .input('ProveedorId', proveedor_id)
      .query('SELECT ProveedorId FROM Proveedor WHERE ProveedorId = @ProveedorId')

    if (check_result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    await pool.request()
      .input('ProveedorId', proveedor_id)
      .input('ProveedorNombre', body.proveedor_nombre)
      .query(`
        UPDATE Proveedor
        SET ProveedorNombre = @ProveedorNombre
        WHERE ProveedorId = @ProveedorId
      `)

    return NextResponse.json({ message: 'Proveedor actualizado exitosamente' })
  } catch (error: any) {
    console.error('Error al actualizar proveedor:', error)
    return NextResponse.json(
      { error: 'Error al actualizar proveedor', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/proveedores/[id] - Eliminar un proveedor
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const proveedor_id = parseInt(params.id)

    const check_result = await pool.request()
      .input('ProveedorId', proveedor_id)
      .query('SELECT ProveedorId FROM Proveedor WHERE ProveedorId = @ProveedorId')

    if (check_result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    await pool.request()
      .input('ProveedorId', proveedor_id)
      .query('DELETE FROM Proveedor WHERE ProveedorId = @ProveedorId')

    return NextResponse.json({ message: 'Proveedor eliminado exitosamente' })
  } catch (error: any) {
    console.error('Error al eliminar proveedor:', error)
    return NextResponse.json(
      { error: 'Error al eliminar proveedor', details: error.message },
      { status: 500 }
    )
  }
}
