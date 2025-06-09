"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  X,
  Minimize2,
  Maximize2,
  Volume2,
  Settings,
  Music,
  Video,
  MessageCircle,
  Monitor,
  Camera,
  Mic,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from "lucide-react"

interface DraggableWindow {
  id: string
  title: string
  type: "music" | "video" | "chat" | "stream" | "media" | "settings"
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isVisible: boolean
  isLocked: boolean
  zIndex: number
  content?: any
}

interface DraggableWindowManagerProps {
  children?: React.ReactNode
}

export function DraggableWindowManager({ children }: DraggableWindowManagerProps) {
  const [windows, setWindows] = useState<DraggableWindow[]>([])
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null)
  const [resizedWindow, setResizedWindow] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [maxZIndex, setMaxZIndex] = useState(1000)

  const containerRef = useRef<HTMLDivElement>(null)

  // Create a new window
  const createWindow = useCallback(
    (type: DraggableWindow["type"], title: string, content?: any) => {
      const newWindow: DraggableWindow = {
        id: `window-${Date.now()}-${Math.random()}`,
        title,
        type,
        position: {
          x: 100 + windows.length * 30,
          y: 100 + windows.length * 30,
        },
        size: {
          width: type === "chat" ? 350 : type === "music" ? 400 : 600,
          height: type === "chat" ? 500 : type === "music" ? 300 : 400,
        },
        isMinimized: false,
        isMaximized: false,
        isVisible: true,
        isLocked: false,
        zIndex: maxZIndex + 1,
        content,
      }

      setWindows((prev) => [...prev, newWindow])
      setMaxZIndex((prev) => prev + 1)
      return newWindow.id
    },
    [windows.length, maxZIndex],
  )

  // Update window
  const updateWindow = useCallback((id: string, updates: Partial<DraggableWindow>) => {
    setWindows((prev) => prev.map((window) => (window.id === id ? { ...window, ...updates } : window)))
  }, [])

  // Close window
  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((window) => window.id !== id))
  }, [])

  // Bring window to front
  const bringToFront = useCallback(
    (id: string) => {
      const newZIndex = maxZIndex + 1
      setMaxZIndex(newZIndex)
      updateWindow(id, { zIndex: newZIndex })
    },
    [maxZIndex, updateWindow],
  )

  // Handle mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, windowId: string, action: "drag" | "resize") => {
      e.preventDefault()
      const window = windows.find((w) => w.id === windowId)
      if (!window || window.isLocked) return

      bringToFront(windowId)

      if (action === "drag") {
        setDraggedWindow(windowId)
        setDragOffset({
          x: e.clientX - window.position.x,
          y: e.clientY - window.position.y,
        })
      } else if (action === "resize") {
        setResizedWindow(windowId)
        setResizeStart({
          x: e.clientX,
          y: e.clientY,
          width: window.size.width,
          height: window.size.height,
        })
      }
    },
    [windows, bringToFront],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (draggedWindow) {
        const containerRect = containerRef.current?.getBoundingClientRect()
        if (!containerRect) return

        const newX = Math.max(0, Math.min(containerRect.width - 200, e.clientX - containerRect.left - dragOffset.x))
        const newY = Math.max(0, Math.min(containerRect.height - 50, e.clientY - containerRect.top - dragOffset.y))

        updateWindow(draggedWindow, {
          position: { x: newX, y: newY },
        })
      } else if (resizedWindow) {
        const deltaX = e.clientX - resizeStart.x
        const deltaY = e.clientY - resizeStart.y

        const newWidth = Math.max(250, resizeStart.width + deltaX)
        const newHeight = Math.max(200, resizeStart.height + deltaY)

        updateWindow(resizedWindow, {
          size: { width: newWidth, height: newHeight },
        })
      }
    },
    [draggedWindow, resizedWindow, dragOffset, resizeStart, updateWindow],
  )

  const handleMouseUp = useCallback(() => {
    setDraggedWindow(null)
    setResizedWindow(null)
  }, [])

  // Add event listeners
  useEffect(() => {
    if (draggedWindow || resizedWindow) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [draggedWindow, resizedWindow, handleMouseMove, handleMouseUp])

  // Window content renderers
  const renderWindowContent = (window: DraggableWindow) => {
    switch (window.type) {
      case "music":
        return <MusicPlayerContent />
      case "video":
        return <VideoPlayerContent />
      case "chat":
        return <ChatContent />
      case "stream":
        return <StreamContent />
      case "media":
        return <MediaLibraryContent />
      case "settings":
        return <SettingsContent />
      default:
        return <div className="p-4 text-white">Content for {window.type}</div>
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {children}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => createWindow("music", "Music Player")}
          className="bg-pink-600 hover:bg-pink-700 text-white"
        >
          <Music className="h-4 w-4 mr-2" />
          Music
        </Button>
        <Button
          onClick={() => createWindow("video", "Video Player")}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Video className="h-4 w-4 mr-2" />
          Video
        </Button>
        <Button onClick={() => createWindow("chat", "Live Chat")} className="bg-blue-600 hover:bg-blue-700 text-white">
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <Button
          onClick={() => createWindow("media", "Media Library")}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Media
        </Button>
        <Button
          onClick={() => createWindow("stream", "Stream Control")}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Monitor className="h-4 w-4 mr-2" />
          Stream
        </Button>
      </div>

      {/* Render Windows */}
      {windows.map((window) => (
        <div
          key={window.id}
          className="absolute"
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.isMaximized ? "100%" : window.size.width,
            height: window.isMaximized ? "100%" : window.isMinimized ? "auto" : window.size.height,
            zIndex: window.zIndex,
            display: window.isVisible ? "block" : "none",
          }}
        >
          <Card className="h-full flex flex-col bg-gray-900/95 backdrop-blur-md border-gray-600 shadow-2xl">
            {/* Window Header */}
            <CardHeader
              className="pb-2 cursor-move bg-gray-800/50 select-none"
              onMouseDown={(e) => handleMouseDown(e, window.id, "drag")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {window.type === "music" && <Music className="h-4 w-4 text-pink-400" />}
                  {window.type === "video" && <Video className="h-4 w-4 text-red-400" />}
                  {window.type === "chat" && <MessageCircle className="h-4 w-4 text-blue-400" />}
                  {window.type === "stream" && <Monitor className="h-4 w-4 text-purple-400" />}
                  {window.type === "media" && <Upload className="h-4 w-4 text-green-400" />}
                  {window.type === "settings" && <Settings className="h-4 w-4 text-gray-400" />}
                  <CardTitle className="text-white text-sm">{window.title}</CardTitle>
                  {window.isLocked && <Lock className="h-3 w-3 text-yellow-400" />}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateWindow(window.id, { isLocked: !window.isLocked })}
                    className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300"
                  >
                    {window.isLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateWindow(window.id, { isVisible: !window.isVisible })}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-gray-300"
                  >
                    {window.isVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateWindow(window.id, { isMinimized: !window.isMinimized })}
                    className="h-6 w-6 p-0 text-yellow-400 hover:text-yellow-300"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateWindow(window.id, { isMaximized: !window.isMaximized })}
                    className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => closeWindow(window.id)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Window Content */}
            {!window.isMinimized && (
              <CardContent className="flex-1 p-4 overflow-auto">{renderWindowContent(window)}</CardContent>
            )}

            {/* Resize Handle */}
            {!window.isMinimized && !window.isMaximized && !window.isLocked && (
              <div
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-blue-600/50 hover:bg-blue-500 rounded-tl-sm"
                onMouseDown={(e) => handleMouseDown(e, window.id, "resize")}
              />
            )}
          </Card>
        </div>
      ))}
    </div>
  )
}

// Content Components
function MusicPlayerContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [currentTrack, setCurrentTrack] = useState(0)

  const playlist = [
    { name: "Stream Intro", artist: "Ustream4Free", duration: "0:30" },
    { name: "Background Beats", artist: "StreamBeats", duration: "3:45" },
    { name: "Gaming Vibes", artist: "GameMusic", duration: "2:20" },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-white">{playlist[currentTrack].name}</h4>
            <p className="text-sm text-gray-400">{playlist[currentTrack].artist}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-gray-400" />
          <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
          <span className="text-sm text-gray-400 w-10">{volume[0]}%</span>
        </div>
      </div>

      <div className="space-y-2">
        {playlist.map((track, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrack(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === currentTrack ? "bg-pink-600/50" : "bg-gray-800/30 hover:bg-gray-700/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-medium text-white">{track.name}</div>
                <div className="text-xs text-gray-400">{track.artist}</div>
              </div>
              <div className="text-xs text-gray-400">{track.duration}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VideoPlayerContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([80])

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
        <div className="text-center text-white">
          <Video className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <p>Video Player</p>
          <Badge className={isPlaying ? "bg-red-600" : "bg-gray-600"}>{isPlaying ? "PLAYING" : "PAUSED"}</Badge>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-gray-400" />
        <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
        <span className="text-sm text-gray-400 w-10">{volume[0]}%</span>
      </div>
    </div>
  )
}

function ChatContent() {
  const [messages] = useState([
    { user: "StreamBot", message: "Welcome to the stream! 🎉", time: "12:34" },
    { user: "Viewer123", message: "Great quality!", time: "12:35" },
    { user: "ProGamer", message: "Love this setup!", time: "12:36" },
  ])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-blue-400">{msg.user}</span>
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
            <p className="text-sm text-white">{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        />
        <Button className="bg-blue-600 hover:bg-blue-700">Send</Button>
      </div>
    </div>
  )
}

function StreamContent() {
  const [isStreaming, setIsStreaming] = useState(false)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Monitor className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Stream Control</h3>
        <Badge className={isStreaming ? "bg-red-600" : "bg-gray-600"}>{isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}</Badge>
      </div>

      <Button
        onClick={() => setIsStreaming(!isStreaming)}
        className={`w-full ${isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
      >
        {isStreaming ? "Stop Stream" : "Start Stream"}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
          <Mic className="h-4 w-4 mr-2" />
          Mic
        </Button>
      </div>
    </div>
  )
}

function MediaLibraryContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Media Library</h3>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Video className="h-8 w-8 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-white">Videos</p>
          <p className="text-xs text-gray-400">5 files</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Music className="h-8 w-8 mx-auto mb-2 text-pink-400" />
          <p className="text-sm text-white">Audio</p>
          <p className="text-xs text-gray-400">12 files</p>
        </div>
      </div>

      <div className="space-y-2">
        {["intro.mp4", "background.mp3", "overlay.png"].map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
            <span className="text-sm text-white">{file}</span>
            <Button size="sm" variant="ghost" className="text-blue-400">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Settings</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Auto-save Layout</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Show Grid</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Snap to Grid</span>
          <Switch />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-white">Theme</label>
        <select className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white">
          <option>Dark</option>
          <option>Light</option>
          <option>Auto</option>
        </select>
      </div>
    </div>
  )
}
