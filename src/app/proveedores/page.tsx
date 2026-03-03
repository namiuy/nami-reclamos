'use client'

import { MainLayout } from '@/components/layout/main_layout'
import { ProveedoresList } from '@/components/proveedores/proveedores_list'

export default function ProveedoresPage() {
  return (
    <MainLayout>
      <ProveedoresList />
    </MainLayout>
  )
}
