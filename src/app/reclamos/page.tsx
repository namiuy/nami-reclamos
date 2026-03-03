'use client'

import { MainLayout } from '@/components/layout/main_layout'
import { ReclamosList } from '@/components/reclamos/reclamos_list'

export default function ReclamosPage() {
  return (
    <MainLayout>
      <ReclamosList />
    </MainLayout>
  )
}
