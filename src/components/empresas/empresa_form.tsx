'use client'

import { useForm, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useState } from 'react'

type EmpresaFormData = {
  empresa_nombre: string
}

type EmpresaFormProps = {
  initial_data?: EmpresaFormData & { empresa_id?: number }
  is_edit_mode?: boolean
}

export function EmpresaForm({ initial_data, is_edit_mode = false }: EmpresaFormProps) {
  const router = useRouter()
  const [submitting, set_submitting] = useState(false)
  const [error, set_error] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpresaFormData>({
    defaultValues: initial_data || {
      empresa_nombre: '',
    },
  })

  const on_submit = async (data: EmpresaFormData) => {
    set_submitting(true)
    set_error(null)

    try {
      const url = is_edit_mode
        ? `/api/empresas/${initial_data?.empresa_id}`
        : '/api/empresas'
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
        router.push('/empresas')
      } else {
        set_error(result.error || 'Error al guardar la empresa')
      }
    } catch (err) {
      set_error('Error de conexión')
    } finally {
      set_submitting(false)
    }
  }

  const handle_cancel = () => {
    router.push('/empresas')
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {is_edit_mode ? 'Editar Empresa' : 'Nueva Empresa'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(on_submit)} noValidate>
          <Controller
            name="empresa_nombre"
            control={control}
            rules={{ required: 'El nombre de la empresa es requerido' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nombre de la Empresa"
                fullWidth
                error={!!errors.empresa_nombre}
                helperText={errors.empresa_nombre?.message}
                required
                sx={{ mb: 3 }}
              />
            )}
          />

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
        </Box>
      </CardContent>
    </Card>
  )
}
