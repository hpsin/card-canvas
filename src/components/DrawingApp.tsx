import React, { useState } from 'react'
import { DrawingCanvas } from '@/components/DrawingCanvas'
import { ColorPalette } from '@/components/ColorPalette'

export function DrawingApp() {
  const [selectedColor, setSelectedColor] = useState('#000000')
  const brushSize = 4

  return (
    <div className="relative min-h-screen bg-background">
      <DrawingCanvas selectedColor={selectedColor} brushSize={brushSize} />
      
      {/* Color palette positioned at top center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <ColorPalette 
            selectedColor={selectedColor} 
            onColorChange={setSelectedColor} 
          />
        </div>
      </div>
    </div>
  )
}