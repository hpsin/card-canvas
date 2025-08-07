import React from 'react'
import { DrawingApp } from '@/components/DrawingApp'
import { AdminPanel } from '@/components/AdminPanel'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const urlParams = new URLSearchParams(window.location.search)
  const isAdminMode = urlParams.get('admin') === 'true'
  
  return (
    <div>
      {isAdminMode ? <AdminPanel /> : <DrawingApp />}
      <Toaster />
    </div>
  )
}

export default App