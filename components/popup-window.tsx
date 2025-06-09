"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PopupWindowProps {
  title: string
  defaultPosition?: { x: number; y: number }
  defaultSize?: { width: number; height: number }
  minWidth?: number
  minHeight?: number
  isOpen?: boolean
  onClose?: () => void
  children: React.ReactNode
  className?: string
}

export function PopupWindow({
  title,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  minWidth = 250,
  minHeight = 200,
  isOpen = true,
  onClose,
  children,
  className = "",
}: PopupWindowProps) {
  const [position, setPosition] = useState(defaultPosition)
  const [size, setSize] = useState(defaultSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [previousState, setPreviousState] = useState({ position, size })

  const windowRef = useRef<HTMLDivElement>(null)

  // Handle window dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
    }
  }

  // Handle window resizing
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: Math.max(0, e.clientX - dragStart.x),
        y: Math.max(0, e.clientY - dragStart.y),
      })
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y

      setSize({
        width: Math.max(minWidth, resizeStart.width + deltaX),
        height: Math.max(minHeight, resizeStart.height + deltaY),
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  // Add and remove event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing])

  // Handle maximize/minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleMaximize = () => {
    if (!isMaximized) {
      setPreviousState({ position, size })
      setPosition({ x: 0, y: 0 })
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsMaximized(true)
    } else {
      setPosition(previousState.position)
      setSize(previousState.size)
      setIsMaximized(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className={`fixed z-50 shadow-lg ${className}`}
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: isMinimized ? "auto" : size.height,
      }}
    >
      <Card className="h-full flex flex-col bg-gray-900/95 backdrop-blur-md border-gray-600">
        <CardHeader className="pb-2 cursor-move drag-handle bg-gray-800/50" onMouseDown={handleMouseDown}>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-sm">{title}</CardTitle>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMinimize}
                className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-900/50"
              >
                <Minimize2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleMaximize}
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50"
              >
                <Maximize2 className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/50"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && <CardContent className="flex-1 p-4 overflow-auto">{children}</CardContent>}

        {/* Resize handle */}
        {!isMinimized && !isMaximized && (
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-600/50 hover:bg-blue-500 rounded-tl-sm"
            onMouseDown={handleResizeStart}
          />
        )}
      </Card>
    </div>
  )
}
