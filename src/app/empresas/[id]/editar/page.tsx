'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main_layout'
import { EmpresaForm } from '@/components/empresas/empresa_form'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

export default function EditarEmpresaPage() {
  const params = useParams()
  const empresa_id = params.id as string
  const [empresa_data, set_empresa_data] = useState<any>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const fetch_empresa = async () => {
      try {
        const response = await fetch(`/api/empresas/${empresa_id}`)
        const data = await response.json()

        if (response.ok) {
          set_empresa_data(data)
        } else {
          set_error(data.error || 'Error al cargar empresa')
        }
      } catch (err) {
        set_error('Error de conexión')
      } finally {
        set_loading(false)
      }
    }

    fetch_empresa()
  }, [empresa_id])

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
      {empresa_data && <EmpresaForm initial_data={empresa_data} is_edit_mode={true} />}
    </MainLayout>
  )
}
