'use client'

import { useRouter, usePathname } from 'next/navigation'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Divider from '@mui/material/Divider'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BusinessIcon from '@mui/icons-material/Business'
import PersonIcon from '@mui/icons-material/Person'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import AssessmentIcon from '@mui/icons-material/Assessment'

const DRAWER_WIDTH = 240

type MenuItem = {
  text: string
  icon: React.ReactNode
  path: string
}

const menu_items: MenuItem[] = [
  {
    text: 'Reclamos',
    icon: <AssignmentIcon />,
    path: '/reclamos',
  },
  {
    text: 'Proveedores',
    icon: <LocalShippingIcon />,
    path: '/proveedores',
  },
  {
    text: 'Empresas',
    icon: <BusinessIcon />,
    path: '/empresas',
  },
  {
    text: 'Personas',
    icon: <PersonIcon />,
    path: '/personas',
  },
  {
    text: 'Reportes',
    icon: <AssessmentIcon />,
    path: '/reportes',
  },
]

export function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()

  const handle_navigate = (path: string) => {
    router.push(path)
  }

  const is_active = (path: string) => {
    return pathname.startsWith(path)
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        {menu_items.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={is_active(item.path)}
              onClick={() => handle_navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export { DRAWER_WIDTH }
