'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
  GridActionsCellItem,
} from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type PersonaRow = {
  persona_id: number
  persona_nombre: string
}

export function PersonasList() {
  const router = useRouter()
  const [rows, set_rows] = useState<PersonaRow[]>([])
  const [loading, set_loading] = useState(true)
  const [total_rows, set_total_rows] = useState(0)
  const [pagination_model, set_pagination_model] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [delete_dialog_open, set_delete_dialog_open] = useState(false)
  const [selected_persona_id, set_selected_persona_id] = useState<number | null>(null)
  const [snackbar, set_snackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const fetch_personas = async () => {
    set_loading(true)
    try {
      const response = await fetch(
        `/api/personas?page=${pagination_model.page + 1}&page_size=${pagination_model.pageSize}`
      )
      const data = await response.json()

      if (response.ok) {
        set_rows(data.data)
        set_total_rows(data.pagination.total)
      } else {
        set_snackbar({
          open: true,
          message: data.error || 'Error al cargar personas',
          severity: 'error',
        })
      }
    } catch (error) {
      set_snackbar({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      })
    } finally {
      set_loading(false)
    }
  }

  useEffect(() => {
    fetch_personas()
  }, [pagination_model])

  const handle_edit = (id: number) => {
    router.push(`/personas/${id}/editar`)
  }

  const handle_delete_click = (id: number) => {
    set_selected_persona_id(id)
    set_delete_dialog_open(true)
  }

  const handle_delete_confirm = async () => {
    if (!selected_persona_id) return

    try {
      const response = await fetch(`/api/personas/${selected_persona_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        set_snackbar({
          open: true,
          message: 'Persona eliminada exitosamente',
          severity: 'success',
        })
        fetch_personas()
      } else {
        const data = await response.json()
        set_snackbar({
          open: true,
          message: data.error || 'Error al eliminar persona',
          severity: 'error',
        })
      }
    } catch (error) {
      set_snackbar({
        open: true,
        message: 'Error de conexión',
        severity: 'error',
      })
    } finally {
      set_delete_dialog_open(false)
      set_selected_persona_id(null)
    }
  }

  const handle_delete_cancel = () => {
    set_delete_dialog_open(false)
    set_selected_persona_id(null)
  }

  const handle_new_persona = () => {
    router.push('/personas/nuevo')
  }

  const columns: GridColDef[] = [
    {
      field: 'persona_id',
      headerName: 'ID',
      width: 100,
    },
    {
      field: 'persona_nombre',
      headerName: 'Nombre de la Persona',
      flex: 1,
      minWidth: 300,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handle_edit(params.row.persona_id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handle_delete_click(params.row.persona_id)}
        />,
      ],
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Personas</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handle_new_persona}
        >
          Nueva Persona
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.persona_id}
          rowCount={total_rows}
          loading={loading}
          pageSizeOptions={[10, 25, 50]}
          paginationModel={pagination_model}
          paginationMode="server"
          onPaginationModelChange={set_pagination_model}
        />
      </Box>

      <Dialog open={delete_dialog_open} onClose={handle_delete_cancel}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea eliminar esta persona? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handle_delete_cancel}>Cancelar</Button>
          <Button onClick={handle_delete_confirm} color="error" variant="contained">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => set_snackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
