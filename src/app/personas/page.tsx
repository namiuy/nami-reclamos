'use client'

import { MainLayout } from '@/components/layout/main_layout'
import { PersonasList } from '@/components/personas/personas_list'

export default function PersonasPage() {
  return (
    <MainLayout>
      <PersonasList />
    </MainLayout>
  )
}
