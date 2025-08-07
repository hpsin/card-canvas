import React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Eraser } from '@phosphor-icons/react'

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
    <div className="flex flex-col gap-2">
      {colors.map((color) => (
        <Button
          key={color.value}
          onClick={() => onColorChange(color.value)}
          onTouchStart={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          className={cn(
            "w-12 h-12 rounded-full p-0 border-2 transition-all duration-200 touch-manipulation",
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
            <Eraser size={24} className="text-gray-600" />
          )}
        </Button>
      ))}
    </div>
  )
}