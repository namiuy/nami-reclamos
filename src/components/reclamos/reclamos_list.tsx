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
import IconButton from '@mui/material/IconButton'
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
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

type ReclamoRow = {
  reclamo_id: number
  reclamo_fecha: string
  reclamo_motivo: string
  reclamo_articulo_nombre: string
  reclamo_cantidad: number
  reclamo_estado_sircal: string
  reclamo_estado_proveedor: string
  proveedor_id: number
}

export function ReclamosList() {
  const router = useRouter()
  const [rows, set_rows] = useState<ReclamoRow[]>([])
  const [loading, set_loading] = useState(true)
  const [total_rows, set_total_rows] = useState(0)
  const [pagination_model, set_pagination_model] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  })
  const [delete_dialog_open, set_delete_dialog_open] = useState(false)
  const [selected_reclamo_id, set_selected_reclamo_id] = useState<number | null>(null)
  const [snackbar, set_snackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const fetch_reclamos = async () => {
    set_loading(true)
    try {
      const response = await fetch(
        `/api/reclamos?page=${pagination_model.page + 1}&page_size=${pagination_model.pageSize}`
      )
      const data = await response.json()

      if (response.ok) {
        set_rows(data.data)
        set_total_rows(data.pagination.total)
      } else {
        set_snackbar({
          open: true,
          message: data.error || 'Error al cargar reclamos',
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
    fetch_reclamos()
  }, [pagination_model])

  const handle_edit = (id: number) => {
    router.push(`/reclamos/${id}/editar`)
  }

  const handle_delete_click = (id: number) => {
    set_selected_reclamo_id(id)
    set_delete_dialog_open(true)
  }

  const handle_delete_confirm = async () => {
    if (!selected_reclamo_id) return

    try {
      const response = await fetch(`/api/reclamos/${selected_reclamo_id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        set_snackbar({
          open: true,
          message: 'Reclamo eliminado exitosamente',
          severity: 'success',
        })
        fetch_reclamos()
      } else {
        const data = await response.json()
        set_snackbar({
          open: true,
          message: data.error || 'Error al eliminar reclamo',
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
      set_selected_reclamo_id(null)
    }
  }

  const handle_delete_cancel = () => {
    set_delete_dialog_open(false)
    set_selected_reclamo_id(null)
  }

  const handle_new_reclamo = () => {
    router.push('/reclamos/nuevo')
  }

  const columns: GridColDef[] = [
    {
      field: 'reclamo_id',
      headerName: 'ID',
      width: 80,
    },
    {
      field: 'reclamo_fecha',
      headerName: 'Fecha',
      width: 150,
      valueFormatter: (value: string) => {
        return format(new Date(value), 'dd/MM/yyyy HH:mm', { locale: es })
      },
    },
    {
      field: 'reclamo_motivo',
      headerName: 'Motivo',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'reclamo_articulo_nombre',
      headerName: 'Artículo',
      width: 180,
    },
    {
      field: 'reclamo_cantidad',
      headerName: 'Cantidad',
      width: 100,
      type: 'number',
    },
    {
      field: 'reclamo_estado_sircal',
      headerName: 'Estado Sircal',
      width: 130,
    },
    {
      field: 'reclamo_estado_proveedor',
      headerName: 'Estado Proveedor',
      width: 150,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handle_edit(params.row.reclamo_id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => handle_delete_click(params.row.reclamo_id)}
        />,
      ],
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Reclamos</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handle_new_reclamo}
        >
          Nuevo Reclamo
        </Button>
      </Box>

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.reclamo_id}
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
            ¿Está seguro que desea eliminar este reclamo? Esta acción no se puede deshacer.
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
