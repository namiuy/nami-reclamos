'use client'

import { MainLayout } from '@/components/layout/main_layout'
import { EmpresasList } from '@/components/empresas/empresas_list'

export default function EmpresasPage() {
  return (
    <MainLayout>
      <EmpresasList />
    </MainLayout>
  )
}
