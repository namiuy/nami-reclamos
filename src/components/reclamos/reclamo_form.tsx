'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { reclamo_schema, ReclamoFormData } from '@/lib/validations'
import { ESTADOS_SIRCAL, ESTADOS_PROVEEDOR } from '@/types/reclamo'
import { useState } from 'react'

type ReclamoFormProps = {
  initial_data?: Partial<ReclamoFormData> & { reclamo_id?: number }
  is_edit_mode?: boolean
}

export function ReclamoForm({ initial_data, is_edit_mode = false }: ReclamoFormProps) {
  const router = useRouter()
  const [submitting, set_submitting] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReclamoFormData>({
    resolver: zodResolver(reclamo_schema),
    defaultValues: initial_data || {
      reclamo_motivo: '',
      reclamo_motivo_ingles: '',
      proveedor_id: 1,
      reclamo_fecha: new Date().toISOString().slice(0, 16),
      reclamo_artiiculo: '',
      reclamo_articulo_nombre: '',
      reclamo_cantidad: 1,
      reclamo_codigo_proveedor: '',
      reclamo_observaciones: '',
      reclamo_observaciones_ingles: '',
      reclamo_estado_sircal: 'Pendiente',
      reclamo_estado_proveedor: 'Pendiente',
      empresa_id: 1,
      persona_id: 1,
      reclamo_precio_fob: 0,
    },
  })

  const on_submit = async (data: ReclamoFormData) => {
    set_submitting(true)
    set_error(null)

    try {
      const url = is_edit_mode
        ? `/api/reclamos/${initial_data?.reclamo_id}`
        : '/api/reclamos'
      const method = is_edit_mode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        router.push('/reclamos')
      } else {
        set_error(result.error || 'Error al guardar el reclamo')
      }
    } catch (err) {
      set_error('Error de conexión')
    } finally {
      set_submitting(false)
    }
  }

  const handle_cancel = () => {
    router.push('/reclamos')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {is_edit_mode ? 'Editar Reclamo' : 'Nuevo Reclamo'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(on_submit)} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_motivo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Motivo (Español)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.reclamo_motivo}
                    helperText={errors.reclamo_motivo?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_motivo_ingles"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Motivo (Inglés)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.reclamo_motivo_ingles}
                    helperText={errors.reclamo_motivo_ingles?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_articulo_nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre del Artículo"
                    fullWidth
                    error={!!errors.reclamo_articulo_nombre}
                    helperText={errors.reclamo_articulo_nombre?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_artiiculo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Código del Artículo"
                    fullWidth
                    error={!!errors.reclamo_artiiculo}
                    helperText={errors.reclamo_artiiculo?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="reclamo_cantidad"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    label="Cantidad"
                    type="number"
                    fullWidth
                    error={!!errors.reclamo_cantidad}
                    helperText={errors.reclamo_cantidad?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="reclamo_precio_fob"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    label="Precio FOB"
                    type="number"
                    fullWidth
                    error={!!errors.reclamo_precio_fob}
                    helperText={errors.reclamo_precio_fob?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="reclamo_fecha"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Fecha"
                    type="datetime-local"
                    fullWidth
                    error={!!errors.reclamo_fecha}
                    helperText={errors.reclamo_fecha?.message}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="proveedor_id"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    label="ID Proveedor"
                    type="number"
                    fullWidth
                    error={!!errors.proveedor_id}
                    helperText={errors.proveedor_id?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="empresa_id"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    label="ID Empresa"
                    type="number"
                    fullWidth
                    error={!!errors.empresa_id}
                    helperText={errors.empresa_id?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                name="persona_id"
                control={control}
                render={({ field: { onChange, value, ...field } }) => (
                  <TextField
                    {...field}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                    label="ID Persona"
                    type="number"
                    fullWidth
                    error={!!errors.persona_id}
                    helperText={errors.persona_id?.message}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_estado_sircal"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado Sircal"
                    fullWidth
                    error={!!errors.reclamo_estado_sircal}
                    helperText={errors.reclamo_estado_sircal?.message}
                    required
                  >
                    {ESTADOS_SIRCAL.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_estado_proveedor"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Estado Proveedor"
                    fullWidth
                    error={!!errors.reclamo_estado_proveedor}
                    helperText={errors.reclamo_estado_proveedor?.message}
                    required
                  >
                    {ESTADOS_PROVEEDOR.map((estado) => (
                      <MenuItem key={estado} value={estado}>
                        {estado}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_observaciones"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observaciones (Español)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.reclamo_observaciones}
                    helperText={errors.reclamo_observaciones?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="reclamo_observaciones_ingles"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Observaciones (Inglés)"
                    fullWidth
                    multiline
                    rows={3}
                    error={!!errors.reclamo_observaciones_ingles}
                    helperText={errors.reclamo_observaciones_ingles?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handle_cancel}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : null}
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  )
}
