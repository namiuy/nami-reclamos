import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

// GET /api/reclamos - Obtener lista de reclamos
export async function GET(request: NextRequest) {
  try {
    const pool = await get_database_pool()

    // Obtener parámetros de query para paginación
    const search_params = request.nextUrl.searchParams
    const page = parseInt(search_params.get('page') || '1')
    const page_size = parseInt(search_params.get('page_size') || '10')
    const offset = (page - 1) * page_size

    // Query para obtener reclamos con paginación
    const result = await pool.request().query(`
      SELECT
        ReclamoId as reclamo_id,
        ReclamoFecha as reclamo_fecha,
        ReclamoMotivo as reclamo_motivo,
        ReclamoArticuloNombre as reclamo_articulo_nombre,
        ReclamoCantidad as reclamo_cantidad,
        ReclamoEstadoSircal as reclamo_estado_sircal,
        ReclamoEstadoProveedor as reclamo_estado_proveedor,
        ProveedorId as proveedor_id,
        EmpresaId as empresa_id,
        PersonaId as persona_id
      FROM Reclamo
      ORDER BY ReclamoFecha DESC
      OFFSET ${offset} ROWS
      FETCH NEXT ${page_size} ROWS ONLY
    `)

    // Query para obtener total de registros
    const count_result = await pool.request().query(`
      SELECT COUNT(*) as total FROM Reclamo
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
    console.error('Error al obtener reclamos:', error)
    return NextResponse.json(
      { error: 'Error al obtener reclamos', details: error.message },
      { status: 500 }
    )
  }
}

// POST /api/reclamos - Crear nuevo reclamo
export async function POST(request: NextRequest) {
  try {
    const pool = await get_database_pool()
    const body = await request.json()

    // Insertar nuevo reclamo
    const result = await pool.request()
      .input('ReclamoMotivo', body.reclamo_motivo)
      .input('ProveedorId', body.proveedor_id)
      .input('ReclamoFecha', body.reclamo_fecha || new Date())
      .input('ReclamoArtiiculo', body.reclamo_artiiculo || '')
      .input('ReclamoArticuloNombre', body.reclamo_articulo_nombre)
      .input('ReclamoCantidad', body.reclamo_cantidad)
      .input('ReclamoCodigoProveedor', body.reclamo_codigo_proveedor || '')
      .input('ReclamoObservaciones', body.reclamo_observaciones || '')
      .input('ReclamoEstadoSircal', body.reclamo_estado_sircal || 'Pendiente')
      .input('ReclamoEstadoProveedor', body.reclamo_estado_proveedor || 'Pendiente')
      .input('EmpresaId', body.empresa_id)
      .input('PersonaId', body.persona_id)
      .input('ReclamoPrecioFOB', body.reclamo_precio_fob || 0)
      .input('ReclamoMotivoIngles', body.reclamo_motivo_ingles || '')
      .input('ReclamoObservacionesIngles', body.reclamo_observaciones_ingles || '')
      .input('ReclamoFotoIdUltima', body.reclamo_foto_id_ultima || 0)
      .query(`
        INSERT INTO Reclamo (
          ReclamoMotivo,
          ReclamoFactura,
          ProveedorId,
          ReclamoFecha,
          ReclamoArtiiculo,
          ReclamoArticuloNombre,
          ReclamoCantidad,
          ReclamoCodigoProveedor,
          ReclamoObservaciones,
          ReclamoEstadoSircal,
          ReclamoEstadoProveedor,
          EmpresaId,
          PersonaId,
          ReclamoPrecioFOB,
          ReclamoMotivoIngles,
          ReclamoObservacionesIngles,
          ReclamoVideo,
          ReclamoVideo_GXI,
          ReclamoFotoIdUltima
        ) VALUES (
          @ReclamoMotivo,
          0x,
          @ProveedorId,
          @ReclamoFecha,
          @ReclamoArtiiculo,
          @ReclamoArticuloNombre,
          @ReclamoCantidad,
          @ReclamoCodigoProveedor,
          @ReclamoObservaciones,
          @ReclamoEstadoSircal,
          @ReclamoEstadoProveedor,
          @EmpresaId,
          @PersonaId,
          @ReclamoPrecioFOB,
          @ReclamoMotivoIngles,
          @ReclamoObservacionesIngles,
          0x,
          '',
          @ReclamoFotoIdUltima
        );
        SELECT SCOPE_IDENTITY() as reclamo_id;
      `)

    const new_reclamo_id = result.recordset[0].reclamo_id

    return NextResponse.json(
      { message: 'Reclamo creado exitosamente', reclamo_id: new_reclamo_id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error al crear reclamo:', error)
    return NextResponse.json(
      { error: 'Error al crear reclamo', details: error.message },
      { status: 500 }
    )
  }
}
