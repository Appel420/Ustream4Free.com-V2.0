"use client"

import React from "react"
import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Monitor,
  Camera,
  Music,
  MessageCircle,
  Video,
  ImageIcon,
  Type,
  Layers,
  Trash2,
  Copy,
  Lock,
  Grid,
  Smartphone,
  Grid3X3,
  Maximize,
  Minimize,
  RotateCcw,
  Upload,
  Download,
  Eye,
  Settings,
} from "lucide-react"

interface LayoutElement {
  id: string
  name: string
  type: "webcam" | "screen" | "media" | "chat" | "text" | "image" | "audio-visualizer"
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  visible: boolean
  locked: boolean
  zIndex: number
  properties: Record<string, any>
}

interface StreamLayoutManagerProps {
  onLayoutChange: (elements: any[]) => void
}

export function StreamLayoutManager({ onLayoutChange }: StreamLayoutManagerProps) {
  const [selectedLayout, setSelectedLayout] = useState("fullscreen")
  const [layoutElements, setLayoutElements] = useState<LayoutElement[]>([
    {
      id: "webcam",
      name: "Webcam",
      type: "webcam",
      x: 10,
      y: 10,
      width: 320,
      height: 240,
      rotation: 0,
      opacity: 100,
      visible: true,
      locked: false,
      zIndex: 2,
      properties: { borderRadius: 10, borderColor: "#8b5cf6" },
    },
    {
      id: "chat",
      name: "Chat Overlay",
      type: "chat",
      x: 350,
      y: 10,
      width: 300,
      height: 400,
      rotation: 0,
      opacity: 90,
      visible: true,
      locked: false,
      zIndex: 1,
      properties: { backgroundColor: "rgba(0,0,0,0.8)", fontSize: 14 },
    },
    {
      id: "alerts",
      name: "Alerts",
      type: "text",
      x: 10,
      y: 270,
      width: 400,
      height: 100,
      rotation: 0,
      opacity: 100,
      visible: true,
      locked: false,
      zIndex: 3,
      properties: {},
    },
  ])

  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [layoutSize, setLayoutSize] = useState({ width: 1920, height: 1080 })
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [showGrid, setShowGrid] = useState(true)

  const layoutRef = useRef<HTMLDivElement>(null)

  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value
    return Math.round(value / gridSize) * gridSize
  }

  const handleElementMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const element = layoutElements.find((el) => el.id === elementId)
    if (!element || element.locked) return

    setSelectedElement(elementId)
    setIsDragging(true)
    setDragStart({
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    })
  }

  const handleElementTouchStart = (e: React.TouchEvent, elementId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const touch = e.touches[0]
    setSelectedElement(elementId)
    setIsDragging(true)
    setDragStart({
      x: touch.clientX,
      y: touch.clientY,
    })
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !selectedElement) return

      const element = layoutElements.find((el) => el.id === selectedElement)
      if (!element) return

      const newX = snapToGridValue(Math.max(0, Math.min(layoutSize.width - element.width, e.clientX - dragStart.x)))
      const newY = snapToGridValue(Math.max(0, Math.min(layoutSize.height - element.height, e.clientY - dragStart.y)))

      setLayoutElements((prev) => prev.map((el) => (el.id === selectedElement ? { ...el, x: newX, y: newY } : el)))
    },
    [isDragging, selectedElement, dragStart, layoutSize, snapToGrid, gridSize],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || !selectedElement) return

      e.preventDefault()
      const touch = e.touches[0]
      const element = layoutElements.find((el) => el.id === selectedElement)
      if (!element) return

      const newX = snapToGridValue(Math.max(0, Math.min(layoutSize.width - element.width, touch.clientX - dragStart.x)))
      const newY = snapToGridValue(
        Math.max(0, Math.min(layoutSize.height - element.height, touch.clientY - dragStart.y)),
      )

      setLayoutElements((prev) => prev.map((el) => (el.id === selectedElement ? { ...el, x: newX, y: newY } : el)))
    },
    [isDragging, selectedElement, dragStart, layoutSize, snapToGrid, gridSize],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  // Event listeners
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, handleMouseMove, handleTouchMove, handleMouseUp])

  const addElement = (type: LayoutElement["type"]) => {
    const newElement: LayoutElement = {
      id: `${type}-${Date.now()}`,
      name: type.charAt(0).toUpperCase() + type.slice(1),
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 150,
      rotation: 0,
      opacity: 100,
      visible: true,
      locked: false,
      zIndex: Math.max(...layoutElements.map((el) => el.zIndex), 0) + 1,
      properties: {},
    }

    setLayoutElements([...layoutElements, newElement])
  }

  const updateElement = (id: string, updates: Partial<LayoutElement>) => {
    setLayoutElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }

  const deleteElement = (id: string) => {
    setLayoutElements((prev) => prev.filter((el) => el.id !== id))
    if (selectedElement === id) {
      setSelectedElement(null)
    }
  }

  const duplicateElement = (id: string) => {
    const element = layoutElements.find((el) => el.id === id)
    if (!element) return

    const newElement: LayoutElement = {
      ...element,
      id: `${element.type}-${Date.now()}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: Math.max(...layoutElements.map((el) => el.zIndex), 0) + 1,
    }

    setLayoutElements([...layoutElements, newElement])
  }

  const getElementIcon = (type: LayoutElement["type"]) => {
    switch (type) {
      case "webcam":
        return <Camera className="h-4 w-4" />
      case "screen":
        return <Monitor className="h-4 w-4" />
      case "media":
        return <Video className="h-4 w-4" />
      case "chat":
        return <MessageCircle className="h-4 w-4" />
      case "text":
        return <Type className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "audio-visualizer":
        return <Music className="h-4 w-4" />
      default:
        return <Layers className="h-4 w-4" />
    }
  }

  const layouts = [
    { id: "fullscreen", name: "Fullscreen", icon: <Maximize className="h-4 w-4" /> },
    { id: "split", name: "Split Screen", icon: <Grid3X3 className="h-4 w-4" /> },
    { id: "pip", name: "Picture in Picture", icon: <Minimize className="h-4 w-4" /> },
    { id: "mobile", name: "Mobile Optimized", icon: <Smartphone className="h-4 w-4" /> },
  ]

  const handleLayoutSelect = (layoutId: string) => {
    setSelectedLayout(layoutId)
    onLayoutChange(layoutElements)
  }

  const toggleElementVisibility = (elementId: string) => {
    setLayoutElements((prev) => prev.map((el) => (el.id === elementId ? { ...el, visible: !el.visible } : el)))
  }

  const selectedElementData = layoutElements.find((el) => el.id === selectedElement)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Layout Canvas */}
      <div className="lg:col-span-2">
        <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Monitor className="h-5 w-5" />
                Stream Layout
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-gray-600 text-gray-300">
                  {layoutSize.width}x{layoutSize.height}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`border-gray-600 ${showGrid ? "bg-purple-600 text-white" : "text-white hover:bg-gray-800"}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div
              ref={layoutRef}
              className="relative bg-black border border-gray-700 mx-4 mb-4 overflow-hidden"
              style={{
                width: "100%",
                aspectRatio: `${layoutSize.width}/${layoutSize.height}`,
                backgroundImage: showGrid
                  ? `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`
                  : "none",
                backgroundSize: showGrid ? `${gridSize}px ${gridSize}px` : "auto",
              }}
              onClick={() => setSelectedElement(null)}
            >
              {layoutElements.map((element) => (
                <div
                  key={element.id}
                  className={`absolute cursor-move select-none transition-all duration-200 ${
                    selectedElement === element.id ? "ring-2 ring-purple-500" : ""
                  } ${element.locked ? "cursor-not-allowed" : ""}`}
                  style={{
                    left: `${(element.x / layoutSize.width) * 100}%`,
                    top: `${(element.y / layoutSize.height) * 100}%`,
                    width: `${(element.width / layoutSize.width) * 100}%`,
                    height: `${(element.height / layoutSize.height) * 100}%`,
                    transform: `rotate(${element.rotation}deg)`,
                    opacity: element.opacity / 100,
                    zIndex: element.zIndex,
                    display: element.visible ? "block" : "none",
                  }}
                  onMouseDown={(e) => handleElementMouseDown(e, element.id)}
                  onTouchStart={(e) => handleElementTouchStart(e, element.id)}
                >
                  {element.name}

                  {/* Element Controls */}
                  {selectedElement === element.id && !element.locked && (
                    <div className="absolute -top-8 left-0 flex gap-1">
                      <Button
                        size="sm"
                        className="h-6 w-6 p-0 bg-blue-600 hover:bg-blue-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateElement(element.id)
                        }}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-6 w-6 p-0 bg-red-600 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteElement(element.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Resize Handle */}
                  {selectedElement === element.id && !element.locked && (
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-purple-600 cursor-se-resize"
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        setIsResizing(true)
                      }}
                    />
                  )}

                  {/* Lock Indicator */}
                  {element.locked && (
                    <div className="absolute top-1 right-1">
                      <Lock className="h-3 w-3 text-yellow-400" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Panel */}
      <div className="space-y-4">
        {/* Layout Presets */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Layout Presets</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {layouts.map((layout) => (
              <Button
                key={layout.id}
                size="sm"
                variant={selectedLayout === layout.id ? "default" : "outline"}
                className={
                  selectedLayout === layout.id
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "border-gray-600 text-white hover:bg-gray-800"
                }
                onClick={() => handleLayoutSelect(layout.id)}
              >
                {layout.icon}
                <span className="ml-1 text-xs">{layout.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Layout Elements */}
        <div>
          <h4 className="text-sm font-medium text-white mb-2">Layout Elements</h4>
          <div className="space-y-2">
            {layoutElements.map((element) => (
              <div key={element.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Button size="sm" variant="ghost" onClick={() => toggleElementVisibility(element.id)} className="p-1">
                    <Eye className={`h-4 w-4 ${element.visible ? "text-green-400" : "text-gray-500"}`} />
                  </Button>
                  <div>
                    <div className="text-sm font-medium text-white">{element.name}</div>
                    <div className="text-xs text-gray-400">
                      {element.width}x{element.height} at ({element.x}, {element.y})
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Layout Actions */}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            <Upload className="h-4 w-4 mr-1" />
            Import Layout
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            <Download className="h-4 w-4 mr-1" />
            Export Layout
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset Layout
          </Button>
        </div>

        {/* Preview */}
        <div className="bg-gray-800/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Layout Preview</span>
          </div>
          <div className="bg-black rounded aspect-video relative overflow-hidden">
            {layoutElements
              .filter((el) => el.visible)
              .map((element) => (
                <div
                  key={element.id}
                  className="absolute bg-blue-600/50 border border-blue-400 rounded text-xs text-white p-1"
                  style={{
                    left: `${(element.x / 1920) * 100}%`,
                    top: `${(element.y / 1080) * 100}%`,
                    width: `${(element.width / 1920) * 100}%`,
                    height: `${(element.height / 1080) * 100}%`,
                  }}
                >
                  {element.name}
                </div>
              ))}
          </div>
        </div>

        {/* Element Properties */}
        {selectedElementData && (
          <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-white">
                {getElementIcon(selectedElementData.type)}
                Element Properties
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="transform" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                  <TabsTrigger value="transform">Transform</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="transform" className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Position X</label>
                    <Slider
                      value={[selectedElementData.x]}
                      max={layoutSize.width - selectedElementData.width}
                      step={snapToGrid ? gridSize : 1}
                      onValueChange={(value) =>
                        updateElement(selectedElementData.id, {
                          x: value[0],
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Position Y</label>
                    <Slider
                      value={[selectedElementData.y]}
                      max={layoutSize.height - selectedElementData.height}
                      step={snapToGrid ? gridSize : 1}
                      onValueChange={(value) =>
                        updateElement(selectedElementData.id, {
                          y: value[0],
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Width</label>
                    <Slider
                      value={[selectedElementData.width]}
                      min={50}
                      max={layoutSize.width}
                      step={snapToGrid ? gridSize : 1}
                      onValueChange={(value) =>
                        updateElement(selectedElementData.id, {
                          width: value[0],
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Height</label>
                    <Slider
                      value={[selectedElementData.height]}
                      min={50}
                      max={layoutSize.height}
                      step={snapToGrid ? gridSize : 1}
                      onValueChange={(value) =>
                        updateElement(selectedElementData.id, {
                          height: value[0],
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Rotation</label>
                    <Slider
                      value={[selectedElementData.rotation]}
                      min={-180}
                      max={180}
                      step={1}
                      onValueChange={(value) => updateElement(selectedElementData.id, { rotation: value[0] })}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Opacity</label>
                    <Slider
                      value={[selectedElementData.opacity]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => updateElement(selectedElementData.id, { opacity: value[0] })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Z-Index</label>
                    <Slider
                      value={[selectedElementData.zIndex]}
                      min={0}
                      max={10}
                      step={1}
                      onValueChange={(value) => updateElement(selectedElementData.id, { zIndex: value[0] })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Visible</span>
                    <Switch
                      checked={selectedElementData.visible}
                      onCheckedChange={(checked) => updateElement(selectedElementData.id, { visible: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Locked</span>
                    <Switch
                      checked={selectedElementData.locked}
                      onCheckedChange={(checked) => updateElement(selectedElementData.id, { locked: checked })}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => duplicateElement(selectedElementData.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  onClick={() => deleteElement(selectedElementData.id)}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Layout Settings */}
        <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white">Layout Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Snap to Grid</span>
              <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Grid</span>
              <Switch checked={showGrid} onCheckedChange={setShowGrid} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Grid Size</label>
              <Slider value={[gridSize]} min={10} max={50} step={5} onValueChange={(value) => setGridSize(value[0])} />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Layout Resolution</label>
              <select
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                value={`${layoutSize.width}x${layoutSize.height}`}
                onChange={(e) => {
                  const [width, height] = e.target.value.split("x").map(Number)
                  setLayoutSize({ width, height })
                }}
              >
                <option value="1920x1080">1920x1080 (1080p)</option>
                <option value="1280x720">1280x720 (720p)</option>
                <option value="854x480">854x480 (480p)</option>
                <option value="1920x1200">1920x1200 (16:10)</option>
                <option value="2560x1440">2560x1440 (1440p)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
