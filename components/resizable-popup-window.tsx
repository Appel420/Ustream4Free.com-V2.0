"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { X, Minimize2, Maximize2, Move } from "lucide-react"

interface ResizablePopupWindowProps {
  id: string
  title: string
  isOpen: boolean
  onClose: () => void
  initialWidth?: number
  initialHeight?: number
  initialX?: number
  initialY?: number
  children: React.ReactNode
  color?: string
}

export function ResizablePopupWindow({
  id,
  title,
  isOpen,
  onClose,
  initialWidth = 350,
  initialHeight = 500,
  initialX = 50,
  initialY = 50,
  children,
  color = "#9146FF",
}: ResizablePopupWindowProps) {
  const [position, setPosition] = useState({ x: initialX, y: initialY })
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [originalSize, setOriginalSize] = useState({ width: initialWidth, height: initialHeight })
  const [originalPosition, setOriginalPosition] = useState({ x: initialX, y: initialY })

  const windowRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Touch handling for pinch-to-zoom
  const [initialDistance, setInitialDistance] = useState<number | null>(null)
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 })

  // Handle window dragging
  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()

    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    setIsDragging(true)
    setDragOffset({
      x: clientX - position.x,
      y: clientY - position.y,
    })
  }

  // Handle window resizing
  const startResize = (e: React.MouseEvent | React.TouchEvent, direction: string) => {
    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setResizeDirection(direction)

    let clientX: number
    let clientY: number

    if ("touches" in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    setDragOffset({
      x: clientX,
      y: clientY,
    })
  }

  // Handle pinch-to-zoom
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault()

      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      setInitialDistance(distance)
      setInitialSize({ ...size })
    }
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault()

      const touch = e.touches[0]
      const newX = touch.clientX - dragOffset.x
      const newY = touch.clientY - dragOffset.y

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 50, newY)),
      })
    } else if (isResizing && e.touches.length === 1) {
      e.preventDefault()

      const touch = e.touches[0]
      handleResize(touch.clientX, touch.clientY)
    } else if (e.touches.length === 2 && initialDistance !== null) {
      e.preventDefault()

      const touch1 = e.touches[0]
      const touch2 = e.touches[1]

      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY)

      const scale = distance / initialDistance

      setSize({
        width: Math.max(250, Math.min(window.innerWidth - 20, initialSize.width * scale)),
        height: Math.max(200, Math.min(window.innerHeight - 20, initialSize.height * scale)),
      })
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setIsResizing(false)
    setInitialDistance(null)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault()

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
        y: Math.max(0, Math.min(window.innerHeight - 50, newY)),
      })
    } else if (isResizing) {
      e.preventDefault()
      handleResize(e.clientX, e.clientY)
    }
  }

  const handleResize = (clientX: number, clientY: number) => {
    if (!resizeDirection) return

    let newWidth = size.width
    let newHeight = size.height
    let newX = position.x
    let newY = position.y

    const deltaX = clientX - dragOffset.x
    const deltaY = clientY - dragOffset.y

    switch (resizeDirection) {
      case "e":
        newWidth = size.width + deltaX
        break
      case "s":
        newHeight = size.height + deltaY
        break
      case "se":
        newWidth = size.width + deltaX
        newHeight = size.height + deltaY
        break
      case "w":
        newWidth = size.width - deltaX
        newX = position.x + deltaX
        break
      case "n":
        newHeight = size.height - deltaY
        newY = position.y + deltaY
        break
      case "ne":
        newWidth = size.width + deltaX
        newHeight = size.height - deltaY
        newY = position.y + deltaY
        break
      case "nw":
        newWidth = size.width - deltaX
        newHeight = size.height - deltaY
        newX = position.x + deltaX
        newY = position.y + deltaY
        break
      case "sw":
        newWidth = size.width - deltaX
        newHeight = size.height + deltaY
        newX = position.x + deltaX
        break
    }

    // Apply constraints
    newWidth = Math.max(250, Math.min(window.innerWidth - 20, newWidth))
    newHeight = Math.max(200, Math.min(window.innerHeight - 20, newHeight))
    newX = Math.max(0, Math.min(window.innerWidth - newWidth, newX))
    newY = Math.max(0, Math.min(window.innerHeight - newHeight, newY))

    setSize({ width: newWidth, height: newHeight })
    setPosition({ x: newX, y: newY })
    setDragOffset({ x: clientX, y: clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const toggleMaximize = () => {
    if (!isMaximized) {
      setOriginalSize({ ...size })
      setOriginalPosition({ ...position })

      setSize({
        width: window.innerWidth - 20,
        height: window.innerHeight - 20,
      })

      setPosition({ x: 10, y: 10 })
      setIsMaximized(true)
    } else {
      setSize({ ...originalSize })
      setPosition({ ...originalPosition })
      setIsMaximized(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchmove", handleTouchMove, { passive: false })
      document.addEventListener("touchend", handleTouchEnd)

      const windowElement = windowRef.current
      if (windowElement) {
        windowElement.addEventListener("touchstart", handleTouchStart, { passive: false })
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchmove", handleTouchMove)
        document.removeEventListener("touchend", handleTouchEnd)

        if (windowElement) {
          windowElement.removeEventListener("touchstart", handleTouchStart)
        }
      }
    }
  }, [isOpen, isDragging, isResizing, dragOffset, position, size, resizeDirection, initialDistance, initialSize])

  if (!isOpen) return null

  return (
    <div
      ref={windowRef}
      className="fixed z-50 overflow-hidden select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: isMinimized ? "auto" : `${size.height}px`,
        background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(20,20,20,0.98) 50%, rgba(0,0,0,0.95) 100%)`,
        backdropFilter: "blur(20px)",
        border: `2px solid ${color}`,
        borderRadius: "12px",
        boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 40px ${color}40`,
      }}
    >
      {/* Window Header */}
      <div
        className="flex items-center justify-between p-3 cursor-move select-none"
        style={{
          background: `linear-gradient(135deg, ${color}20 0%, rgba(0,0,0,0.95) 100%)`,
          borderBottom: `2px solid ${color}40`,
        }}
        onMouseDown={(e) => {
          // Only start drag if clicking on header background, not buttons
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
            startDrag(e)
          }
        }}
        onTouchStart={(e) => {
          // Only start drag if touching header background, not buttons
          if (e.target === e.currentTarget || (e.target as HTMLElement).closest(".drag-handle")) {
            startDrag(e)
          }
        }}
      >
        <div className="flex items-center gap-2 drag-handle cursor-move">
          <Move className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-white">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            onClick={toggleMinimize}
            style={{ backgroundColor: isMinimized ? "#f59e0b40" : "transparent" }}
          >
            <Minimize2 className="h-4 w-4 text-yellow-400" />
          </button>
          <button
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            onClick={toggleMaximize}
            style={{ backgroundColor: isMaximized ? "#22c55e40" : "transparent" }}
          >
            <Maximize2 className="h-4 w-4 text-green-400" />
          </button>
          <button className="p-1 rounded-full hover:bg-gray-700 transition-colors" onClick={onClose}>
            <X className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </div>

      {/* Window Content - SCROLLABLE AND INTERACTIVE */}
      {!isMinimized && (
        <div
          ref={contentRef}
          className="flex-1 overflow-auto"
          style={{
            height: "calc(100% - 48px)",
            background: `linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(10,10,10,0.95) 50%, rgba(0,0,0,0.9) 100%)`,
            WebkitOverflowScrolling: "touch",
            overscrollBehavior: "contain",
            touchAction: "auto",
          }}
          onTouchStart={(e) => {
            // Allow content interaction, prevent window dragging
            e.stopPropagation()
          }}
          onMouseDown={(e) => {
            // Allow content interaction, prevent window dragging
            e.stopPropagation()
          }}
          onTouchMove={(e) => {
            // Allow scrolling within content
            e.stopPropagation()
          }}
        >
          {children}
        </div>
      )}

      {/* Resize Handles */}
      {!isMinimized && !isMaximized && (
        <>
          {/* Corner handles */}
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize transition-colors"
            style={{
              background: `linear-gradient(-45deg, transparent 0%, transparent 35%, ${color} 35%, ${color} 65%, transparent 65%)`,
            }}
            onMouseDown={(e) => startResize(e, "ne")}
            onTouchStart={(e) => startResize(e, "ne")}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize transition-colors"
            style={{
              background: `linear-gradient(-135deg, transparent 0%, transparent 35%, ${color} 35%, ${color} 65%, transparent 65%)`,
            }}
            onMouseDown={(e) => startResize(e, "nw")}
            onTouchStart={(e) => startResize(e, "nw")}
          />
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize transition-colors rounded-tl-lg"
            style={{
              background: `linear-gradient(45deg, transparent 0%, transparent 35%, ${color} 35%, ${color} 65%, transparent 65%)`,
            }}
            onMouseDown={(e) => startResize(e, "se")}
            onTouchStart={(e) => startResize(e, "se")}
          >
            <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-white/50" />
          </div>
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize transition-colors"
            style={{
              background: `linear-gradient(135deg, transparent 0%, transparent 35%, ${color} 35%, ${color} 65%, transparent 65%)`,
            }}
            onMouseDown={(e) => startResize(e, "sw")}
            onTouchStart={(e) => startResize(e, "sw")}
          />

          {/* Edge handles */}
          <div
            className="absolute top-0 left-4 right-4 h-2 cursor-n-resize hover:bg-blue-600/40 transition-colors"
            onMouseDown={(e) => startResize(e, "n")}
            onTouchStart={(e) => startResize(e, "n")}
          />
          <div
            className="absolute bottom-0 left-4 right-4 h-2 cursor-s-resize hover:bg-blue-600/40 transition-colors"
            onMouseDown={(e) => startResize(e, "s")}
            onTouchStart={(e) => startResize(e, "s")}
          />
          <div
            className="absolute left-0 top-4 bottom-4 w-2 cursor-w-resize hover:bg-blue-600/40 transition-colors"
            onMouseDown={(e) => startResize(e, "w")}
            onTouchStart={(e) => startResize(e, "w")}
          />
          <div
            className="absolute right-0 top-4 bottom-4 w-2 cursor-e-resize hover:bg-blue-600/40 transition-colors"
            onMouseDown={(e) => startResize(e, "e")}
            onTouchStart={(e) => startResize(e, "e")}
          />
        </>
      )}
    </div>
  )
}
