'use client'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { DRAWER_WIDTH } from './sidebar'

export function MainAppBar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
      }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Sistema de Reclamos - NAMI
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
