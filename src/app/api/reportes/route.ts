import { NextRequest, NextResponse } from 'next/server'
import { get_database_pool } from '@/lib/db/connection'

// GET /api/reportes - Obtener reportes y estadísticas
export async function GET(request: NextRequest) {
  try {
    const pool = await get_database_pool()

    // Obtener parámetros de filtro
    const search_params = request.nextUrl.searchParams
    const tipo_reporte = search_params.get('tipo') || 'resumen'

    if (tipo_reporte === 'resumen') {
      // Reporte resumen general
      const [
        total_result,
        por_estado_sircal,
        por_estado_proveedor,
        ultimos_reclamos,
      ] = await Promise.all([
        // Total de reclamos
        pool.request().query(`
          SELECT COUNT(*) as total FROM Reclamo
        `),
        // Por estado Sircal
        pool.request().query(`
          SELECT
            ReclamoEstadoSircal as estado,
            COUNT(*) as cantidad
          FROM Reclamo
          GROUP BY ReclamoEstadoSircal
          ORDER BY cantidad DESC
        `),
        // Por estado Proveedor
        pool.request().query(`
          SELECT
            ReclamoEstadoProveedor as estado,
            COUNT(*) as cantidad
          FROM Reclamo
          GROUP BY ReclamoEstadoProveedor
          ORDER BY cantidad DESC
        `),
        // Últimos 10 reclamos
        pool.request().query(`
          SELECT TOP 10
            ReclamoId as reclamo_id,
            ReclamoFecha as reclamo_fecha,
            ReclamoMotivo as reclamo_motivo,
            ReclamoEstadoSircal as reclamo_estado_sircal
          FROM Reclamo
          ORDER BY ReclamoFecha DESC
        `),
      ])

      return NextResponse.json({
        total: total_result.recordset[0].total,
        por_estado_sircal: por_estado_sircal.recordset,
        por_estado_proveedor: por_estado_proveedor.recordset,
        ultimos_reclamos: ultimos_reclamos.recordset,
      })
    } else if (tipo_reporte === 'por_fecha') {
      // Reporte por rango de fechas
      const fecha_desde = search_params.get('fecha_desde')
      const fecha_hasta = search_params.get('fecha_hasta')

      if (!fecha_desde || !fecha_hasta) {
        return NextResponse.json(
          { error: 'Debe proporcionar fecha_desde y fecha_hasta' },
          { status: 400 }
        )
      }

      const result = await pool.request()
        .input('FechaDesde', fecha_desde)
        .input('FechaHasta', fecha_hasta)
        .query(`
          SELECT
            ReclamoId as reclamo_id,
            ReclamoFecha as reclamo_fecha,
            ReclamoMotivo as reclamo_motivo,
            ReclamoArticuloNombre as reclamo_articulo_nombre,
            ReclamoCantidad as reclamo_cantidad,
            ReclamoEstadoSircal as reclamo_estado_sircal,
            ReclamoEstadoProveedor as reclamo_estado_proveedor
          FROM Reclamo
          WHERE ReclamoFecha BETWEEN @FechaDesde AND @FechaHasta
          ORDER BY ReclamoFecha DESC
        `)

      const count_result = await pool.request()
        .input('FechaDesde', fecha_desde)
        .input('FechaHasta', fecha_hasta)
        .query(`
          SELECT COUNT(*) as total
          FROM Reclamo
          WHERE ReclamoFecha BETWEEN @FechaDesde AND @FechaHasta
        `)

      return NextResponse.json({
        data: result.recordset,
        total: count_result.recordset[0].total,
      })
    } else if (tipo_reporte === 'por_estado') {
      // Reporte agrupado por estado
      const result = await pool.request().query(`
        SELECT
          ReclamoEstadoSircal as estado_sircal,
          ReclamoEstadoProveedor as estado_proveedor,
          COUNT(*) as cantidad,
          SUM(ReclamoCantidad) as cantidad_total_articulos,
          AVG(ReclamoPrecioFOB) as precio_fob_promedio
        FROM Reclamo
        GROUP BY ReclamoEstadoSircal, ReclamoEstadoProveedor
        ORDER BY cantidad DESC
      `)

      return NextResponse.json({
        data: result.recordset,
      })
    } else {
      return NextResponse.json(
        { error: 'Tipo de reporte no válido' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error al obtener reportes:', error)
    return NextResponse.json(
      { error: 'Error al obtener reportes', details: error.message },
      { status: 500 }
    )
  }
}
