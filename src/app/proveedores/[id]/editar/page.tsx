'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main_layout'
import { ProveedorForm } from '@/components/proveedores/proveedor_form'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

export default function EditarProveedorPage() {
  const params = useParams()
  const proveedor_id = params.id as string
  const [proveedor_data, set_proveedor_data] = useState<any>(null)
  const [loading, set_loading] = useState(true)
  const [error, set_error] = useState<string | null>(null)

  useEffect(() => {
    const fetch_proveedor = async () => {
      try {
        const response = await fetch(`/api/proveedores/${proveedor_id}`)
        const data = await response.json()

        if (response.ok) {
          set_proveedor_data(data)
        } else {
          set_error(data.error || 'Error al cargar proveedor')
        }
      } catch (err) {
        set_error('Error de conexión')
      } finally {
        set_loading(false)
      }
    }

    fetch_proveedor()
  }, [proveedor_id])

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
      {proveedor_data && <ProveedorForm initial_data={proveedor_data} is_edit_mode={true} />}
    </MainLayout>
  )
}
