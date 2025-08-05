import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'  
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { Save, ArrowCounterClockwise, ArrowClockwise } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DrawingCanvasProps {
  selectedColor: string
  brushSize: number
}

export function DrawingCanvas({ selectedColor, brushSize }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPosition, setLastPosition] = useState<{ x: number; y: number } | null>(null)
  const [drawings, setDrawings] = useKV<Array<{ id: string; name: string; image: string; timestamp: number }>>('drawings', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userName, setUserName] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const getCanvasCoordinates = useCallback((event: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height

    if ('touches' in event) {
      const touch = event.touches[0] || event.changedTouches[0]
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      }
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      }
    }
  }, [])

  const startDrawing = useCallback((event: MouseEvent | TouchEvent) => {
    event.preventDefault()
    const coords = getCanvasCoordinates(event)
    setIsDrawing(true)
    setLastPosition(coords)
  }, [getCanvasCoordinates])

  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    setHistory(currentHistory => {
      const newHistory = currentHistory.slice(0, historyIndex + 1)
      newHistory.push(imageData)
      return newHistory
    })
    setHistoryIndex(current => current + 1)
  }, [historyIndex])

  const draw = useCallback((event: MouseEvent | TouchEvent) => {
    if (!isDrawing || !lastPosition) return
    event.preventDefault()

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const coords = getCanvasCoordinates(event)

    ctx.globalCompositeOperation = selectedColor === 'eraser' ? 'destination-out' : 'source-over'
    ctx.strokeStyle = selectedColor === 'eraser' ? 'rgba(0,0,0,1)' : selectedColor
    // Make eraser bigger and pen size 10% larger
    ctx.lineWidth = selectedColor === 'eraser' ? brushSize * 2.5 : brushSize * 1.1
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    ctx.beginPath()
    ctx.moveTo(lastPosition.x, lastPosition.y)
    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()

    setLastPosition(coords)
  }, [isDrawing, lastPosition, selectedColor, brushSize, getCanvasCoordinates])

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      saveToHistory()
    }
    setIsDrawing(false)
    setLastPosition(null)
  }, [isDrawing, saveToHistory])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseDown = (e: MouseEvent) => startDrawing(e)
    const handleMouseMove = (e: MouseEvent) => draw(e)
    const handleMouseUp = () => stopDrawing()

    const handleTouchStart = (e: TouchEvent) => startDrawing(e)
    const handleTouchMove = (e: TouchEvent) => draw(e)
    const handleTouchEnd = () => stopDrawing()

    canvas.addEventListener('mousedown', handleMouseDown)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseup', handleMouseUp)
    canvas.addEventListener('mouseleave', handleMouseUp)

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false })
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('touchend', handleTouchEnd)
    canvas.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseup', handleMouseUp)
      canvas.removeEventListener('mouseleave', handleMouseUp)

      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('touchend', handleTouchEnd)
      canvas.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [startDrawing, draw, stopDrawing])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const resizeCanvas = () => {
      // Calculate dimensions for 7:5 ratio (height:width)
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      
      // Calculate what the canvas size should be based on 7:5 ratio
      const aspectRatio = 7 / 5 // height / width
      let canvasWidth, canvasHeight
      
      if (windowHeight / windowWidth > aspectRatio) {
        // Window is taller than our ratio, fit to width
        canvasWidth = windowWidth
        canvasHeight = windowWidth * aspectRatio
      } else {
        // Window is wider than our ratio, fit to height
        canvasHeight = windowHeight
        canvasWidth = canvasHeight / aspectRatio
      }
      
      canvas.style.width = `${canvasWidth}px`
      canvas.style.height = `${canvasHeight}px`
      
      canvas.width = canvasWidth * window.devicePixelRatio
      canvas.height = canvasHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // Initialize history with blank canvas after first render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || history.length > 0) return
    
    setTimeout(() => {
      const imageData = canvas.toDataURL()
      setHistory([imageData])
      setHistoryIndex(0)
    }, 100)
  }, [])

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    saveToHistory()
  }

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      setHistoryIndex(current => current - 1)
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = history[historyIndex - 1]
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!canvas || !ctx) return

      setHistoryIndex(current => current + 1)
      const img = new Image()
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
      }
      img.src = history[historyIndex + 1]
    }
  }

  const isCanvasEmpty = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return true

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 255 || data[i + 1] !== 255 || data[i + 2] !== 255) {
        return false
      }
    }
    return true
  }

  const handleSave = () => {
    if (isCanvasEmpty()) {
      toast.error('Please draw something before saving!')
      return
    }
    setIsDialogOpen(true)
  }

  const saveDrawing = () => {
    if (!userName.trim()) {
      toast.error('Please enter your name')
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const imageData = canvas.toDataURL('image/jpeg', 0.8)
      const newDrawing = {
        id: Date.now().toString(),
        name: userName.trim(),
        image: imageData,
        timestamp: Date.now()
      }

      setDrawings(currentDrawings => [...currentDrawings, newDrawing])
      toast.success('Drawing saved successfully!')
      setIsDialogOpen(false)
      setUserName('')
      clearCanvas()
    } catch (error) {
      toast.error('Failed to save drawing')
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="border border-border bg-white cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />
        
        {/* Controls overlay */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-card/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
          <Button 
            onClick={undo} 
            variant="outline" 
            size="sm"
            disabled={historyIndex <= 0}
            className="min-w-0 px-2"
          >
            <ArrowCounterClockwise className="w-4 h-4" />
          </Button>
          
          <Button 
            onClick={redo} 
            variant="outline" 
            size="sm"
            disabled={historyIndex >= history.length - 1}
            className="min-w-0 px-2"
          >
            <ArrowClockwise className="w-4 h-4" />
          </Button>
          
          <Button onClick={clearCanvas} variant="outline" size="sm">
            Clear
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleSave} size="sm" className="bg-accent hover:bg-accent/90">
                <Save className="w-4 h-4 mr-1" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>Save Your Drawing</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="artist-name">Your Name</Label>
                  <Input
                    id="artist-name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your name"
                    onKeyDown={(e) => e.key === 'Enter' && saveDrawing()}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={saveDrawing} className="flex-1">
                    Save Drawing
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}