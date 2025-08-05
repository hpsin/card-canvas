import React from 'react'
import { DrawingApp } from '@/components/DrawingApp'
import { AdminPanel } from '@/components/AdminPanel'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const isAdminRoute = window.location.pathname === '/admin'
  
  return (
    <div>
      {isAdminRoute ? <AdminPanel /> : <DrawingApp />}
      <Toaster />
    </div>
  )
}

export default App