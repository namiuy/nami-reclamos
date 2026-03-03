import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

// GET /api/reclamos/[id] - Obtener un reclamo por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const reclamo_id = parseInt(params.id)

    const result = await pool.request()
      .input('ReclamoId', reclamo_id)
      .query(`
        SELECT
          ReclamoId as reclamo_id,
          ReclamoMotivo as reclamo_motivo,
          ProveedorId as proveedor_id,
          ReclamoFecha as reclamo_fecha,
          ReclamoArtiiculo as reclamo_artiiculo,
          ReclamoArticuloNombre as reclamo_articulo_nombre,
          ReclamoCantidad as reclamo_cantidad,
          ReclamoCodigoProveedor as reclamo_codigo_proveedor,
          ReclamoObservaciones as reclamo_observaciones,
          ReclamoEstadoSircal as reclamo_estado_sircal,
          ReclamoEstadoProveedor as reclamo_estado_proveedor,
          EmpresaId as empresa_id,
          PersonaId as persona_id,
          ReclamoPrecioFOB as reclamo_precio_fob,
          ReclamoMotivoIngles as reclamo_motivo_ingles,
          ReclamoObservacionesIngles as reclamo_observaciones_ingles,
          ReclamoFotoIdUltima as reclamo_foto_id_ultima
        FROM Reclamo
        WHERE ReclamoId = @ReclamoId
      `)

    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Reclamo no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.recordset[0])
  } catch (error: any) {
    console.error('Error al obtener reclamo:', error)
    return NextResponse.json(
      { error: 'Error al obtener reclamo', details: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/reclamos/[id] - Actualizar un reclamo
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const reclamo_id = parseInt(params.id)
    const body = await request.json()

    // Verificar que el reclamo existe
    const check_result = await pool.request()
      .input('ReclamoId', reclamo_id)
      .query('SELECT ReclamoId FROM Reclamo WHERE ReclamoId = @ReclamoId')

    if (check_result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Reclamo no encontrado' },
        { status: 404 }
      )
    }

    // Actualizar reclamo
    await pool.request()
      .input('ReclamoId', reclamo_id)
      .input('ReclamoMotivo', body.reclamo_motivo)
      .input('ReclamoArticuloNombre', body.reclamo_articulo_nombre)
      .input('ReclamoCantidad', body.reclamo_cantidad)
      .input('ReclamoObservaciones', body.reclamo_observaciones)
      .input('ReclamoEstadoSircal', body.reclamo_estado_sircal)
      .input('ReclamoEstadoProveedor', body.reclamo_estado_proveedor)
      .input('ReclamoPrecioFOB', body.reclamo_precio_fob)
      .input('ReclamoMotivoIngles', body.reclamo_motivo_ingles || '')
      .input('ReclamoObservacionesIngles', body.reclamo_observaciones_ingles || '')
      .query(`
        UPDATE Reclamo
        SET
          ReclamoMotivo = @ReclamoMotivo,
          ReclamoArticuloNombre = @ReclamoArticuloNombre,
          ReclamoCantidad = @ReclamoCantidad,
          ReclamoObservaciones = @ReclamoObservaciones,
          ReclamoEstadoSircal = @ReclamoEstadoSircal,
          ReclamoEstadoProveedor = @ReclamoEstadoProveedor,
          ReclamoPrecioFOB = @ReclamoPrecioFOB,
          ReclamoMotivoIngles = @ReclamoMotivoIngles,
          ReclamoObservacionesIngles = @ReclamoObservacionesIngles
        WHERE ReclamoId = @ReclamoId
      `)

    return NextResponse.json({ message: 'Reclamo actualizado exitosamente' })
  } catch (error: any) {
    console.error('Error al actualizar reclamo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar reclamo', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/reclamos/[id] - Eliminar un reclamo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pool = await get_database_pool()
    const reclamo_id = parseInt(params.id)

    // Verificar que el reclamo existe
    const check_result = await pool.request()
      .input('ReclamoId', reclamo_id)
      .query('SELECT ReclamoId FROM Reclamo WHERE ReclamoId = @ReclamoId')

    if (check_result.recordset.length === 0) {
      return NextResponse.json(
        { error: 'Reclamo no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar reclamo
    await pool.request()
      .input('ReclamoId', reclamo_id)
      .query('DELETE FROM Reclamo WHERE ReclamoId = @ReclamoId')

    return NextResponse.json({ message: 'Reclamo eliminado exitosamente' })
  } catch (error: any) {
    console.error('Error al eliminar reclamo:', error)
    return NextResponse.json(
      { error: 'Error al eliminar reclamo', details: error.message },
      { status: 500 }
    )
  }
}
