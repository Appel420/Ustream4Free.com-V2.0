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
  Lock,
  Unlock,
  Move,
} from "lucide-react"

interface DraggableWindow {
  id: string
  title: string
  type: "music" | "video" | "chat" | "stream" | "media" | "settings" | "stats"
  position: { x: number; y: number }
  size: { width: number; height: number }
  isMinimized: boolean
  isMaximized: boolean
  isVisible: boolean
  isLocked: boolean
  zIndex: number
  content?: any
}

interface MobileDraggableWindowManagerProps {
  children?: React.ReactNode
}

export function MobileDraggableWindowManager({ children }: MobileDraggableWindowManagerProps) {
  const [windows, setWindows] = useState<DraggableWindow[]>([])
  const [draggedWindow, setDraggedWindow] = useState<string | null>(null)
  const [resizedWindow, setResizedWindow] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 })
  const [maxZIndex, setMaxZIndex] = useState(1000)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
      setIsMobile(isMobileDevice || isTouchDevice)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Create a new window
  const createWindow = useCallback(
    (type: DraggableWindow["type"], title: string, content?: any) => {
      const existingWindow = windows.find((w) => w.type === type)
      if (existingWindow) {
        // Bring existing window to front and show it
        bringToFront(existingWindow.id)
        updateWindow(existingWindow.id, { isVisible: true, isMinimized: false })
        return existingWindow.id
      }

      const containerRect = containerRef.current?.getBoundingClientRect()
      const containerWidth = containerRect?.width || window.innerWidth
      const containerHeight = containerRect?.height || window.innerHeight

      // Mobile-friendly sizing
      const mobileWidth = Math.min(containerWidth - 40, 350)
      const mobileHeight = Math.min(containerHeight - 100, 400)

      const newWindow: DraggableWindow = {
        id: `window-${Date.now()}-${Math.random()}`,
        title,
        type,
        position: {
          x: isMobile ? 20 : 100 + windows.length * 30,
          y: isMobile ? 100 : 100 + windows.length * 30,
        },
        size: {
          width: isMobile ? mobileWidth : type === "chat" ? 350 : type === "music" ? 400 : 600,
          height: isMobile ? mobileHeight : type === "chat" ? 500 : type === "music" ? 300 : 400,
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
    [windows, maxZIndex, isMobile],
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

  // Get pointer position (works for both mouse and touch)
  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      return { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 }
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
  }

  // Handle pointer down (mouse or touch)
  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent, windowId: string, action: "drag" | "resize") => {
      e.preventDefault()
      e.stopPropagation()

      const window = windows.find((w) => w.id === windowId)
      if (!window || window.isLocked) return

      bringToFront(windowId)
      const pointer = getPointerPosition(e)

      if (action === "drag") {
        setDraggedWindow(windowId)
        setDragOffset({
          x: pointer.x - window.position.x,
          y: pointer.y - window.position.y,
        })
      } else if (action === "resize") {
        setResizedWindow(windowId)
        setResizeStart({
          x: pointer.x,
          y: pointer.y,
          width: window.size.width,
          height: window.size.height,
        })
      }
    },
    [windows, bringToFront],
  )

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      const pointer = getPointerPosition(e)

      if (draggedWindow) {
        const containerRect = containerRef.current?.getBoundingClientRect()
        if (!containerRect) return

        const window = windows.find((w) => w.id === draggedWindow)
        if (!window) return

        const newX = Math.max(
          0,
          Math.min(containerRect.width - window.size.width, pointer.x - containerRect.left - dragOffset.x),
        )
        const newY = Math.max(0, Math.min(containerRect.height - 50, pointer.y - containerRect.top - dragOffset.y))

        updateWindow(draggedWindow, {
          position: { x: newX, y: newY },
        })
      } else if (resizedWindow) {
        const deltaX = pointer.x - resizeStart.x
        const deltaY = pointer.y - resizeStart.y

        const newWidth = Math.max(250, resizeStart.width + deltaX)
        const newHeight = Math.max(200, resizeStart.height + deltaY)

        updateWindow(resizedWindow, {
          size: { width: newWidth, height: newHeight },
        })
      }
    },
    [draggedWindow, resizedWindow, dragOffset, resizeStart, updateWindow, windows],
  )

  const handlePointerUp = useCallback(() => {
    setDraggedWindow(null)
    setResizedWindow(null)
  }, [])

  // Add event listeners for both mouse and touch
  useEffect(() => {
    if (draggedWindow || resizedWindow) {
      const options = { passive: false }

      // Mouse events
      document.addEventListener("mousemove", handlePointerMove, options)
      document.addEventListener("mouseup", handlePointerUp)

      // Touch events
      document.addEventListener("touchmove", handlePointerMove, options)
      document.addEventListener("touchend", handlePointerUp)

      return () => {
        document.removeEventListener("mousemove", handlePointerMove)
        document.removeEventListener("mouseup", handlePointerUp)
        document.removeEventListener("touchmove", handlePointerMove)
        document.removeEventListener("touchend", handlePointerUp)
      }
    }
  }, [draggedWindow, resizedWindow, handlePointerMove, handlePointerUp])

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
      case "stats":
        return <StatsContent />
      default:
        return <div className="p-4 text-white">Content for {window.type}</div>
    }
  }

  return (
    <div ref={containerRef} className="relative w-full h-screen overflow-hidden">
      {children}

      {/* Render Windows */}
      {windows.map((window) => (
        <div
          key={window.id}
          className="absolute touch-none select-none"
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
              className="pb-2 cursor-move bg-gray-800/50 select-none touch-none"
              onMouseDown={(e) => handlePointerDown(e, window.id, "drag")}
              onTouchStart={(e) => handlePointerDown(e, window.id, "drag")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Move className="h-4 w-4 text-gray-400" />
                  {window.type === "music" && <Music className="h-4 w-4 text-pink-400" />}
                  {window.type === "video" && <Video className="h-4 w-4 text-red-400" />}
                  {window.type === "chat" && <MessageCircle className="h-4 w-4 text-blue-400" />}
                  {window.type === "stream" && <Monitor className="h-4 w-4 text-purple-400" />}
                  {window.type === "media" && <Upload className="h-4 w-4 text-green-400" />}
                  {window.type === "settings" && <Settings className="h-4 w-4 text-gray-400" />}
                  {window.type === "stats" && <Settings className="h-4 w-4 text-blue-400" />}
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
                className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-blue-600/50 hover:bg-blue-500 rounded-tl-sm touch-none"
                onMouseDown={(e) => handlePointerDown(e, window.id, "resize")}
                onTouchStart={(e) => handlePointerDown(e, window.id, "resize")}
              >
                <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/50 rounded-full"></div>
              </div>
            )}
          </Card>
        </div>
      ))}

      {/* Mobile-Friendly Floating Action Buttons */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <Button
          onClick={() => createWindow("music", "Music Player")}
          className="bg-pink-600 hover:bg-pink-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <Music className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => createWindow("video", "Video Player")}
          className="bg-red-600 hover:bg-red-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => createWindow("chat", "Live Chat")}
          className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => createWindow("media", "Media Library")}
          className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <Upload className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => createWindow("stream", "Stream Control")}
          className="bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <Monitor className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => createWindow("stats", "Live Stats")}
          className="bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 rounded-full p-0 shadow-lg"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

// Content Components with mobile-friendly designs
function MusicPlayerContent() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [currentTrack, setCurrentTrack] = useState(0)

  const playlist = [
    { name: "Stream Intro", artist: "Ustream4Free", duration: "0:30" },
    { name: "Background Beats", artist: "StreamBeats", duration: "3:45" },
    { name: "Gaming Vibes", artist: "GameMusic", duration: "2:20" },
    { name: "Chill Lofi", artist: "LofiBeats", duration: "4:15" },
    { name: "Outro Theme", artist: "Ustream4Free", duration: "1:00" },
  ]

  return (
    <div className="space-y-4">
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
            <Music className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-white truncate">{playlist[currentTrack].name}</h4>
            <p className="text-sm text-gray-400 truncate">{playlist[currentTrack].artist}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setCurrentTrack(Math.max(0, currentTrack - 1))}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} w-12 h-12 rounded-full`}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => setCurrentTrack(Math.min(playlist.length - 1, currentTrack + 1))}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
          <span className="text-sm text-gray-400 w-10 text-right">{volume[0]}%</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
          <div className="bg-pink-600 h-2 rounded-full" style={{ width: "35%" }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>1:23</span>
          <span>{playlist[currentTrack].duration}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        <h5 className="text-sm font-medium text-white">Playlist</h5>
        {playlist.map((track, index) => (
          <div
            key={index}
            onClick={() => setCurrentTrack(index)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              index === currentTrack ? "bg-pink-600/50" : "bg-gray-800/30 hover:bg-gray-700/50"
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{track.name}</div>
                <div className="text-xs text-gray-400 truncate">{track.artist}</div>
              </div>
              <div className="text-xs text-gray-400 ml-2">{track.duration}</div>
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
      <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative">
        <div className="text-center text-white">
          <Video className="h-12 w-12 mx-auto mb-2 text-red-400" />
          <p className="mb-2">Video Player</p>
          <Badge className={isPlaying ? "bg-red-600" : "bg-gray-600"}>{isPlaying ? "PLAYING" : "PAUSED"}</Badge>
        </div>

        {/* Video overlay controls */}
        <div className="absolute bottom-2 left-2 right-2 bg-black/70 rounded p-2">
          <div className="w-full bg-gray-600 rounded-full h-1 mb-2">
            <div className="bg-red-600 h-1 rounded-full" style={{ width: "45%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-white">
            <span>2:15</span>
            <span>5:00</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`${isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} w-12 h-12 rounded-full`}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Volume2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <Slider value={volume} onValueChange={setVolume} max={100} className="flex-1" />
        <span className="text-sm text-gray-400 w-10 text-right">{volume[0]}%</span>
      </div>

      <div className="bg-blue-900/30 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Stream to Layout</span>
          <Switch />
        </div>
        <div className="text-xs text-gray-400 mt-1">Send video to stream overlay</div>
      </div>
    </div>
  )
}

function ChatContent() {
  const [messages, setMessages] = useState([
    { user: "StreamBot", message: "Welcome to the stream! 🎉", time: "12:34", isMod: true },
    { user: "Viewer123", message: "Great quality!", time: "12:35", isMod: false },
    { user: "ProGamer", message: "Love this setup!", time: "12:36", isMod: false },
    { user: "ModeratorX", message: "Keep it clean everyone!", time: "12:37", isMod: true },
  ])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        user: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        isMod: false,
      }
      setMessages((prev) => [...prev, message])
      setNewMessage("")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-2 overflow-y-auto mb-4 max-h-60">
        {messages.map((msg, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className={`font-medium ${msg.isMod ? "text-green-400" : "text-blue-400"}`}>{msg.user}</span>
              {msg.isMod && <Badge className="bg-green-600 text-xs">MOD</Badge>}
              <span className="text-xs text-gray-400">{msg.time}</span>
            </div>
            <p className="text-sm text-white break-words">{msg.message}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white text-sm"
        />
        <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
          Send
        </Button>
      </div>
    </div>
  )
}

function StreamContent() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [micEnabled, setMicEnabled] = useState(false)
  const [cameraEnabled, setCameraEnabled] = useState(false)

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Monitor className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">Stream Control</h3>
        <Badge className={`${isStreaming ? "bg-red-600" : "bg-gray-600"} text-white`}>
          {isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}
        </Badge>
      </div>

      <Button
        onClick={() => setIsStreaming(!isStreaming)}
        className={`w-full h-12 text-lg font-semibold ${isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
      >
        {isStreaming ? "Stop Stream" : "Start Stream"}
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          size="sm"
          className={`${cameraEnabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"}`}
          onClick={() => setCameraEnabled(!cameraEnabled)}
        >
          <Camera className="h-4 w-4 mr-2" />
          Camera
        </Button>
        <Button
          size="sm"
          className={`${micEnabled ? "bg-orange-600 hover:bg-orange-700" : "bg-gray-600 hover:bg-gray-700"}`}
          onClick={() => setMicEnabled(!micEnabled)}
        >
          <Mic className="h-4 w-4 mr-2" />
          Mic
        </Button>
      </div>

      <div className="bg-purple-900/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-white mb-2">Stream Status</h4>
        <div className="space-y-1 text-xs text-gray-300">
          <div>Uptime: {isStreaming ? "15:32" : "00:00"}</div>
          <div>Viewers: {isStreaming ? "1,234" : "0"}</div>
          <div>Quality: 1080p60</div>
          <div>Bitrate: 6000 kbps</div>
        </div>
      </div>
    </div>
  )
}

function MediaLibraryContent() {
  const [files] = useState([
    { name: "intro.mp4", type: "video", size: "45 MB" },
    { name: "background.mp3", type: "audio", size: "12 MB" },
    { name: "overlay.png", type: "image", size: "2 MB" },
    { name: "outro.mp4", type: "video", size: "23 MB" },
  ])

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
          <p className="text-xs text-gray-400">2 files</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <Music className="h-8 w-8 mx-auto mb-2 text-pink-400" />
          <p className="text-sm text-white">Audio</p>
          <p className="text-xs text-gray-400">1 file</p>
        </div>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto">
        {files.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white truncate">{file.name}</div>
              <div className="text-xs text-gray-400">
                {file.type} • {file.size}
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-blue-400 ml-2">
              <Play className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="bg-green-900/30 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Auto-upload to Stream</span>
          <Switch />
        </div>
        <div className="text-xs text-gray-400 mt-1">Automatically add new files to stream layout</div>
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
        <div className="flex items-center justify-between">
          <span className="text-sm text-white">Mobile Optimized</span>
          <Switch defaultChecked />
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

      <div className="space-y-2">
        <label className="text-sm text-white">Stream Quality</label>
        <select className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white">
          <option>1080p60</option>
          <option>1080p30</option>
          <option>720p60</option>
          <option>720p30</option>
        </select>
      </div>
    </div>
  )
}

function StatsContent() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Live Statistics</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-400">1,234</div>
          <div className="text-xs text-gray-400">Total Viewers</div>
        </div>
        <div className="bg-green-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">3</div>
          <div className="text-xs text-gray-400">Active Platforms</div>
        </div>
        <div className="bg-purple-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-400">456</div>
          <div className="text-xs text-gray-400">Chat Messages</div>
        </div>
        <div className="bg-orange-900/30 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-orange-400">15:32</div>
          <div className="text-xs text-gray-400">Uptime</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-white">Platform Breakdown</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
            <span className="text-sm text-white">🟣 Twitch</span>
            <span className="text-sm text-blue-400">856 viewers</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
            <span className="text-sm text-white">🔴 YouTube</span>
            <span className="text-sm text-blue-400">234 viewers</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-gray-800/30 rounded">
            <span className="text-sm text-white">🔵 Facebook</span>
            <span className="text-sm text-blue-400">144 viewers</span>
          </div>
        </div>
      </div>
    </div>
  )
}
