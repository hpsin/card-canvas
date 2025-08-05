import React, { useEffect, useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Trash2 } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Drawing {
  id: string
  name: string
  image: string
  timestamp: number
}

export function AdminPanel() {
  const [drawings, setDrawings] = useKV<Drawing[]>('drawings', [])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await spark.user()
        setUser(currentUser)
      } catch (error) {
        console.error('Failed to get user:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkUser()
  }, [])

  const downloadDrawing = (drawing: Drawing) => {
    const link = document.createElement('a')
    link.download = `drawing-${drawing.name}-${drawing.id}.jpg`
    link.href = drawing.image
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Downloaded ${drawing.name}'s drawing`)
  }

  const deleteDrawing = (drawingId: string) => {
    setDrawings(currentDrawings => 
      currentDrawings.filter(drawing => drawing.id !== drawingId)
    )
    toast.success('Drawing deleted')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user?.isOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              This page is only available to the app owner.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Admin Panel</CardTitle>
            <p className="text-muted-foreground">
              {drawings.length} drawing{drawings.length !== 1 ? 's' : ''} saved
            </p>
          </CardHeader>
        </Card>

        {drawings.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">No drawings yet</p>
                <p>Drawings will appear here once users start creating and saving them.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drawings.map((drawing) => (
              <Card key={drawing.id} className="overflow-hidden">
                <div className="aspect-square bg-white p-2">
                  <img
                    src={drawing.image}
                    alt={`Drawing by ${drawing.name}`}
                    className="w-full h-full object-contain rounded"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{drawing.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(drawing.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => downloadDrawing(drawing)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={() => deleteDrawing(drawing.id)}
                      variant="destructive"
                      size="sm"
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}