'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main_layout'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid2 from '@mui/material/Unstable_Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ResumenData = {
  total: number
  por_estado_sircal: Array<{ estado: string; cantidad: number }>
  por_estado_proveedor: Array<{ estado: string; cantidad: number }>
  ultimos_reclamos: Array<{
    reclamo_id: number
    reclamo_fecha: string
    reclamo_motivo: string
    reclamo_estado_sircal: string
  }>
}

export default function ReportesPage() {
  const [tab_value, set_tab_value] = useState(0)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)
  const [resumen_data, set_resumen_data] = useState<ResumenData | null>(null)
  const [fecha_desde, set_fecha_desde] = useState('')
  const [fecha_hasta, set_fecha_hasta] = useState('')
  const [reporte_fechas, set_reporte_fechas] = useState<any>(null)

  useEffect(() => {
    fetch_resumen()
  }, [])

  const fetch_resumen = async () => {
    set_loading(true)
    set_error(null)
    try {
      const response = await fetch('/api/reportes?tipo=resumen')
      const data = await response.json()

      if (response.ok) {
        set_resumen_data(data)
      } else {
        set_error(data.error || 'Error al cargar resumen')
      }
    } catch (err) {
      set_error('Error de conexión')
    } finally {
      set_loading(false)
    }
  }

  const handle_buscar_por_fechas = async () => {
    if (!fecha_desde || !fecha_hasta) {
      set_error('Debe seleccionar ambas fechas')
      return
    }

    set_loading(true)
    set_error(null)
    try {
      const response = await fetch(
        `/api/reportes?tipo=por_fecha&fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}`
      )
      const data = await response.json()

      if (response.ok) {
        set_reporte_fechas(data)
      } else {
        set_error(data.error || 'Error al generar reporte')
      }
    } catch (err) {
      set_error('Error de conexión')
    } finally {
      set_loading(false)
    }
  }

  const handle_tab_change = (event: React.SyntheticEvent, new_value: number) => {
    set_tab_value(new_value)
    set_error(null)
  }

  if (loading && !resumen_data) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Typography variant="h4" gutterBottom>
        Reportes
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab_value} onChange={handle_tab_change}>
          <Tab label="Resumen General" />
          <Tab label="Por Fecha" />
        </Tabs>
      </Box>

      {/* TAB 0: Resumen General */}
      {tab_value === 0 && resumen_data && (
        <Grid2 container spacing={3}>
          <Grid2 xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Total de Reclamos
                </Typography>
                <Typography variant="h3" color="primary">
                  {resumen_data.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Por Estado Sircal
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Estado</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resumen_data.por_estado_sircal.map((item) => (
                        <TableRow key={item.estado}>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell align="right">{item.cantidad}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Por Estado Proveedor
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Estado</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resumen_data.por_estado_proveedor.map((item) => (
                        <TableRow key={item.estado}>
                          <TableCell>{item.estado}</TableCell>
                          <TableCell align="right">{item.cantidad}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>

          <Grid2 xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Últimos Reclamos
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell>Estado</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {resumen_data.ultimos_reclamos.map((reclamo) => (
                        <TableRow key={reclamo.reclamo_id}>
                          <TableCell>{reclamo.reclamo_id}</TableCell>
                          <TableCell>
                            {format(new Date(reclamo.reclamo_fecha), 'dd/MM/yyyy HH:mm', {
                              locale: es,
                            })}
                          </TableCell>
                          <TableCell>{reclamo.reclamo_motivo}</TableCell>
                          <TableCell>{reclamo.reclamo_estado_sircal}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>
        </Grid2>
      )}

      {/* TAB 1: Por Fecha */}
      {tab_value === 1 && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Filtrar por Rango de Fechas
              </Typography>
              <Grid2 container spacing={2} alignItems="center">
                <Grid2 xs={12} md={4}>
                  <TextField
                    label="Desde"
                    type="date"
                    fullWidth
                    value={fecha_desde}
                    onChange={(e) => set_fecha_desde(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <TextField
                    label="Hasta"
                    type="date"
                    fullWidth
                    value={fecha_hasta}
                    onChange={(e) => set_fecha_hasta(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid2>
                <Grid2 xs={12} md={4}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handle_buscar_por_fechas}
                    disabled={loading}
                  >
                    {loading ? 'Buscando...' : 'Buscar'}
                  </Button>
                </Grid2>
              </Grid2>
            </CardContent>
          </Card>

          {reporte_fechas && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Resultados: {reporte_fechas.total} reclamos encontrados
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Fecha</TableCell>
                        <TableCell>Motivo</TableCell>
                        <TableCell>Artículo</TableCell>
                        <TableCell align="right">Cantidad</TableCell>
                        <TableCell>Estado Sircal</TableCell>
                        <TableCell>Estado Proveedor</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reporte_fechas.data.map((reclamo: any) => (
                        <TableRow key={reclamo.reclamo_id}>
                          <TableCell>{reclamo.reclamo_id}</TableCell>
                          <TableCell>
                            {format(new Date(reclamo.reclamo_fecha), 'dd/MM/yyyy', {
                              locale: es,
                            })}
                          </TableCell>
                          <TableCell>{reclamo.reclamo_motivo}</TableCell>
                          <TableCell>{reclamo.reclamo_articulo_nombre}</TableCell>
                          <TableCell align="right">{reclamo.reclamo_cantidad}</TableCell>
                          <TableCell>{reclamo.reclamo_estado_sircal}</TableCell>
                          <TableCell>{reclamo.reclamo_estado_proveedor}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </Box>
      )}
    </MainLayout>
  )
}
