import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()
    const result = await pool.request()
      .input('EmpresaId', parseInt(params.id))
      .query(`SELECT EmpresaId as empresa_id, EmpresaNombre as empresa_nombre FROM Empresa WHERE EmpresaId = @EmpresaId`)

    if (result.recordset.length === 0) {
      return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 })
    }
    return NextResponse.json(result.recordset[0])
  } catch (error: any) {
    console.error('Error al obtener empresa:', error)
    return NextResponse.json({ error: 'Error al obtener empresa', details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    const check = await pool.request().input('EmpresaId', parseInt(params.id)).query('SELECT EmpresaId FROM Empresa WHERE EmpresaId = @EmpresaId')
    if (check.recordset.length === 0) return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 })

    await pool.request()
      .input('EmpresaId', parseInt(params.id))
      .input('EmpresaNombre', body.empresa_nombre)
      .query(`UPDATE Empresa SET EmpresaNombre = @EmpresaNombre WHERE EmpresaId = @EmpresaId`)

    return NextResponse.json({ message: 'Empresa actualizada exitosamente' })
  } catch (error: any) {
    console.error('Error al actualizar empresa:', error)
    return NextResponse.json({ error: 'Error al actualizar empresa', details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pool = await get_database_pool()

    const check = await pool.request().input('EmpresaId', parseInt(params.id)).query('SELECT EmpresaId FROM Empresa WHERE EmpresaId = @EmpresaId')
    if (check.recordset.length === 0) return NextResponse.json({ error: 'Empresa no encontrada' }, { status: 404 })

    await pool.request().input('EmpresaId', parseInt(params.id)).query('DELETE FROM Empresa WHERE EmpresaId = @EmpresaId')
    return NextResponse.json({ message: 'Empresa eliminada exitosamente' })
  } catch (error: any) {
    console.error('Error al eliminar empresa:', error)
    return NextResponse.json({ error: 'Error al eliminar empresa', details: error.message }, { status: 500 })
  }
}
