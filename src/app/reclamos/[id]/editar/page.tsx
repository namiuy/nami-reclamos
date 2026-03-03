'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main_layout'
import { ReclamoForm } from '@/components/reclamos/reclamo_form'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { ReclamoFormData } from '@/lib/validations'

export default function EditarReclamoPage() {
  const params = useParams()
  const reclamo_id = params.id as string
  const [reclamo_data, set_reclamo_data] = useState<(Partial<ReclamoFormData> & { reclamo_id: number }) | null>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const fetch_reclamo = async () => {
      try {
        const response = await fetch(`/api/reclamos/${reclamo_id}`)
        const data = await response.json()

        if (response.ok) {
          // Convertir fecha al formato requerido por datetime-local
          const fecha_formateada = new Date(data.reclamo_fecha)
            .toISOString()
            .slice(0, 16)

          set_reclamo_data({
            ...data,
            reclamo_fecha: fecha_formateada,
          })
        } else {
          set_error(data.error || 'Error al cargar reclamo')
        }
      } catch (err) {
        set_error('Error de conexión')
      } finally {
        set_loading(false)
      }
    }

    fetch_reclamo()
  }, [reclamo_id])

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <Alert severity="error">{error}</Alert>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      {reclamo_data && <ReclamoForm initial_data={reclamo_data} is_edit_mode={true} />}
    </MainLayout>
  )
}
