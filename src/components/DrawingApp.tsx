import React, { useState } from 'react'
import { DrawingCanvas } from '@/components/DrawingCanvas'
import { ColorPalette } from '@/components/ColorPalette'

export function DrawingApp() {
  const [selectedColor, setSelectedColor] = useState('#000000')
  const brushSize = 4

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
        <header className="mb-4">
          <h1 className="text-2xl font-bold text-center">Drawing Canvas</h1>
          <p className="text-muted-foreground text-center">
            Create your masterpiece with your finger or mouse
          </p>
        </header>
        
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex-1 min-h-0">
            <DrawingCanvas selectedColor={selectedColor} brushSize={brushSize} />
          </div>
          
          <ColorPalette 
            selectedColor={selectedColor} 
            onColorChange={setSelectedColor} 
          />
        </div>
      </div>
    </div>
  )
}