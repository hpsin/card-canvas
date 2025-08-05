import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ColorPaletteProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

const colors = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Black', value: '#000000' },
  { name: 'Eraser', value: 'eraser' }
]

export function ColorPalette({ selectedColor, onColorChange }: ColorPaletteProps) {
  return (
    <div className="flex gap-2 p-4 bg-card rounded-lg border">
      {colors.map((color) => (
        <Button
          key={color.value}
          onClick={() => onColorChange(color.value)}
          className={cn(
            "w-12 h-12 rounded-full p-0 border-2 transition-all duration-200",
            selectedColor === color.value 
              ? "border-ring shadow-lg scale-110" 
              : "border-border hover:border-ring/50 hover:scale-105"
          )}
          style={{
            backgroundColor: color.value === 'eraser' ? '#f1f5f9' : color.value,
          }}
          title={color.name}
        >
          {color.value === 'eraser' && (
            <div className="w-6 h-6 bg-white border border-gray-300 rounded-sm relative">
              <div className="absolute inset-1 bg-pink-100 rounded-sm opacity-50" />
            </div>
          )}
        </Button>
      ))}
    </div>
  )
}