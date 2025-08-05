import React, { useState } from 'react'
import { DrawingCanvas } from '@/components/DrawingCanvas'
import { ColorPalette } from '@/components/ColorPalette'

export function DrawingApp() {
  const [selectedColor, setSelectedColor] = useState('#000000')
  const [isDrawing, setIsDrawing] = useState(false)
  const brushSize = 4

  return (
    <div className="relative min-h-screen bg-background">
      <DrawingCanvas 
        selectedColor={selectedColor} 
        brushSize={brushSize} 
        onDrawingStateChange={setIsDrawing}
      />
      
      {/* Color palette positioned at bottom left, vertically stacked for better finger access */}
      {/* Semi-transparent when drawing to see underneath */}
      <div className={`fixed bottom-4 left-4 z-10 transition-opacity duration-200 pointer-events-auto ${
        isDrawing ? 'opacity-30' : 'opacity-100'
      }`}>
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