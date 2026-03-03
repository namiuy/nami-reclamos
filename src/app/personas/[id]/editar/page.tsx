'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main_layout'
import { PersonaForm } from '@/components/personas/persona_form'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

export default function EditarPersonaPage() {
  const params = useParams()
  const persona_id = params.id as string
  const [persona_data, set_persona_data] = useState<any>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const fetch_persona = async () => {
      try {
        const response = await fetch(`/api/personas/${persona_id}`)
        const data = await response.json()

        if (response.ok) {
          set_persona_data(data)
        } else {
          set_error(data.error || 'Error al cargar persona')
        }
      } catch (err) {
        set_error('Error de conexión')
      } finally {
        set_loading(false)
      }
    }

    fetch_persona()
  }, [persona_id])

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
      {persona_data && <PersonaForm initial_data={persona_data} is_edit_mode={true} />}
    </MainLayout>
  )
}
