"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Headphones,
  Play,
  Square,
  Eye,
  MessageCircle,
  Users,
  Heart,
  TestTube,
  CheckCircle,
  RefreshCw,
  Send,
} from "lucide-react"

interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl?: string
  color: string
  isActive: boolean
  quality: string
  viewers: number
  streamKeys: Array<{
    id: string
    name: string
    key: string
    isActive: boolean
    isValid: boolean
    lastTested: Date | null
  }>
  activeKeyIndex: number
  connectionStatus: "connected" | "disconnected" | "connecting" | "error"
  uptime: number
  bitrate: number
  fps: number
}

interface PlatformChatWindowProps {
  platform: Platform
  viewerCount: number
}

export function PlatformChatWindow({ platform, viewerCount }: PlatformChatWindowProps) {
  // Stream Keys Management
  const [streamKeys, setStreamKeys] = useState(platform.streamKeys || [])
  const [activeKeyIndex, setActiveKeyIndex] = useState(platform.activeKeyIndex || 0)
  const [isTestingKey, setIsTestingKey] = useState(false)

  // Audio/Video Controls
  const [micVolume, setMicVolume] = useState([75])
  const [headsetVolume, setHeadsetVolume] = useState([80])
  const [outputVolume, setOutputVolume] = useState([85])
  const [micMuted, setMicMuted] = useState(false)
  const [headsetMuted, setHeadsetMuted] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)

  // Stream Settings
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamQuality, setStreamQuality] = useState(platform.quality || "1080p60")
  const [bitrate, setBitrate] = useState([platform.bitrate || 6000])
  const [fps, setFps] = useState(platform.fps || 60)

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "StreamBot", message: `Welcome to ${platform.displayName}! 🎉`, time: "11:45 PM", type: "bot" },
    { id: 2, user: "Moderator", message: "Amazing stream quality! 🔥", time: "11:46 PM", type: "mod" },
    { id: 3, user: "ProViewer", message: "Love the setup!", time: "11:47 PM", type: "viewer" },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [liveStats, setLiveStats] = useState({
    viewers: viewerCount,
    chatMessages: 24,
    followers: Math.floor(Math.random() * 10000),
    donations: Math.floor(Math.random() * 500),
    uptime: "00:45:32",
  })

  // Refs for scrolling
  const chatMessagesRef = useRef<HTMLDivElement>(null)

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isStreaming) {
        setLiveStats((prev) => ({
          ...prev,
          viewers: Math.max(0, prev.viewers + Math.floor(Math.random() * 10 - 5)),
          chatMessages: prev.chatMessages + Math.floor(Math.random() * 3),
        }))
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isStreaming])

  // Simulate incoming chat messages
  useEffect(() => {
    const messages = [
      "This stream quality is incredible! 🔥",
      "Love the professional setup!",
      "Best streamer on the platform! 💜",
      "Amazing content as always!",
      "Keep up the great work! 🎉",
      "Perfect audio quality!",
      "Stream is so smooth!",
    ]

    const users = ["StreamFan", "ProViewer", "ChatLover", "TechGuru", "StreamPro", "ViewerX"]

    const interval = setInterval(() => {
      if (Math.random() < 0.4 && isStreaming) {
        const newMsg = {
          id: Date.now(),
          user: users[Math.floor(Math.random() * users.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
          type: "viewer" as const,
        }
        setChatMessages((prev) => [...prev.slice(-20), newMsg])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isStreaming])

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }, [chatMessages])

  const updateStreamKey = (index: number, key: string) => {
    setStreamKeys((prev) => prev.map((k, i) => (i === index ? { ...k, key, isValid: false } : k)))
  }

  const setActiveKey = (index: number) => {
    setActiveKeyIndex(index)
    setStreamKeys((prev) => prev.map((k, i) => ({ ...k, isActive: i === index })))
  }

  const testStreamKey = async (index: number) => {
    setIsTestingKey(true)
    try {
      // Simulate API call to test stream key
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const isValid = streamKeys[index].key.length > 10 // Simple validation
      setStreamKeys((prev) => prev.map((k, i) => (i === index ? { ...k, isValid, lastTested: new Date() } : k)))
    } catch (error) {
      console.error("Stream key test failed:", error)
    } finally {
      setIsTestingKey(false)
    }
  }

  const sendMessage = () => {
    if (newMessage.trim()) {
      const msg = {
        id: Date.now(),
        user: "You",
        message: newMessage,
        time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        type: "self" as const,
      }
      setChatMessages((prev) => [...prev.slice(-50), msg]) // Keep last 50 messages
      setNewMessage("")
    }
  }

  const toggleStream = () => {
    setIsStreaming(!isStreaming)
  }

  const getPlatformLogo = () => {
    if (platform.logoUrl) {
      return (
        <img
          src={platform.logoUrl || "/placeholder.svg"}
          alt={platform.displayName}
          className="w-8 h-8 rounded object-cover"
          onError={(e) => {
            // Fallback to emoji if image fails to load
            e.currentTarget.style.display = "none"
            const parent = e.currentTarget.parentElement
            if (parent) {
              const fallback = document.createElement("span")
              fallback.className = "text-2xl"
              fallback.textContent = platform.logo
              parent.appendChild(fallback)
            }
          }}
        />
      )
    }

    // Fallback to emoji
    return <span className="text-2xl">{platform.logo}</span>
  }

  return (
    <div className="w-full h-full flex flex-col bg-transparent text-white">
      {/* Header with Platform Info */}
      <div
        className="p-4 border-b-2 flex items-center justify-between flex-shrink-0"
        style={{ borderColor: platform.color }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${platform.color}20`, border: `2px solid ${platform.color}` }}
          >
            {getPlatformLogo()}
          </div>
          <div>
            <h3 className="font-bold text-lg">{platform.displayName}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={isStreaming ? "destructive" : "secondary"}>
                {isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}
              </Badge>
              <Badge variant="outline" style={{ borderColor: platform.color, color: platform.color }}>
                {streamQuality}
              </Badge>
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="text-right text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{liveStats.viewers.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              <span>{liveStats.chatMessages}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              <span>{liveStats.followers.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - FULLY RESPONSIVE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Left Side - Video Preview & Controls */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Video Preview - FUNCTIONAL WITH OVERLAY CONTROLS */}
          <div
            className="relative bg-black flex-1 flex flex-col overflow-hidden border-2 min-h-[300px]"
            style={{ borderColor: `${platform.color}40` }}
          >
            {/* Video Player Area */}
            <div className="flex-1 relative bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
              {videoEnabled ? (
                <div className="w-full h-full relative">
                  {/* Simulated Video Stream */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                    <div className="text-center pointer-events-none">
                      <div className="mb-4 text-6xl" style={{ color: platform.color }}>
                        {getPlatformLogo()}
                      </div>
                      <div className="text-2xl font-bold mb-2">{platform.displayName} Live Stream</div>
                      <div className="text-lg text-gray-300 mb-4">
                        {streamQuality} @ {fps}fps • {bitrate[0]} kbps
                      </div>
                      {isStreaming && (
                        <div className="inline-flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full text-lg font-bold animate-pulse">
                          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                          LIVE
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TOP LEFT CORNER - Audio Controls */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-auto">
                    {/* Microphone Control */}
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        variant={micMuted ? "destructive" : "default"}
                        onClick={() => setMicMuted(!micMuted)}
                        className="w-8 h-8 p-0"
                      >
                        {micMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={micVolume}
                          onValueChange={setMicVolume}
                          max={100}
                          step={1}
                          className="w-full"
                          disabled={micMuted}
                        />
                      </div>
                      <span className="text-xs text-white w-8">{micVolume[0]}%</span>
                    </div>

                    {/* Headset Control */}
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 min-w-[120px]">
                      <Button
                        size="sm"
                        variant={headsetMuted ? "destructive" : "default"}
                        onClick={() => setHeadsetMuted(!headsetMuted)}
                        className="w-8 h-8 p-0"
                      >
                        {headsetMuted ? (
                          <Volume2 className="h-4 w-4 text-red-400" />
                        ) : (
                          <Headphones className="h-4 w-4" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <Slider
                          value={headsetVolume}
                          onValueChange={setHeadsetVolume}
                          max={100}
                          step={1}
                          className="w-full"
                          disabled={headsetMuted}
                        />
                      </div>
                      <span className="text-xs text-white w-8">{headsetVolume[0]}%</span>
                    </div>
                  </div>

                  {/* TOP RIGHT CORNER - Live Stats */}
                  <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center gap-2 pointer-events-none">
                    <Eye className="h-4 w-4" />
                    <span>{liveStats.viewers.toLocaleString()}</span>
                  </div>

                  {/* BOTTOM LEFT CORNER - Video & Stream Controls */}
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-auto">
                    <Button
                      size="sm"
                      onClick={toggleStream}
                      className={isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {isStreaming ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                      {isStreaming ? "Stop" : "Start"}
                    </Button>

                    <Button
                      size="sm"
                      variant={!videoEnabled ? "destructive" : "default"}
                      onClick={() => setVideoEnabled(!videoEnabled)}
                      className="w-10 h-8 p-0"
                    >
                      {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                    </Button>

                    {/* Output Volume Control */}
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2 min-w-[100px]">
                      <Volume2 className="h-4 w-4 text-green-400" />
                      <div className="flex-1">
                        <Slider
                          value={outputVolume}
                          onValueChange={setOutputVolume}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <span className="text-xs text-white w-8">{outputVolume[0]}%</span>
                    </div>
                  </div>

                  {/* BOTTOM RIGHT CORNER - Stream Stats */}
                  <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg text-sm pointer-events-none">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{bitrate[0]} kbps</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>{fps} fps</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isStreaming ? "bg-green-500" : "bg-gray-500"}`}></div>
                        <span>{isStreaming ? "Live" : "Offline"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live Stream Indicator */}
                  {isStreaming && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 px-4 py-2 rounded-full text-lg font-bold animate-pulse flex items-center gap-2 pointer-events-none">
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      LIVE
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 w-full h-full flex flex-col items-center justify-center">
                  <VideoOff className="h-20 w-20 mx-auto mb-4 text-gray-600" />
                  <div className="text-xl font-medium">Video Disabled</div>
                  <div className="text-sm text-gray-400 mt-2">Click the video button to enable</div>
                </div>
              )}
            </div>
          </div>

          {/* Stream Controls - RESPONSIVE HEIGHT */}
          <div className="bg-gray-800/50 overflow-y-auto" style={{ maxHeight: "40vh" }}>
            <div className="p-4 space-y-4">
              {/* Stream Keys Management */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Stream Keys ({activeKeyIndex + 1}/5)</label>
                  <Badge variant="outline">{streamKeys[activeKeyIndex]?.name}</Badge>
                </div>
                <select
                  className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white mb-2"
                  value={activeKeyIndex}
                  onChange={(e) => setActiveKey(Number(e.target.value))}
                >
                  {streamKeys.map((key, index) => (
                    <option key={index} value={index}>
                      {key.name}: {key.key ? `${key.key.substring(0, 20)}...` : "Not Set"}
                      {key.isValid && " ✓"}
                    </option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <Input
                    placeholder={`Enter ${streamKeys[activeKeyIndex]?.name}`}
                    value={streamKeys[activeKeyIndex]?.key || ""}
                    onChange={(e) => updateStreamKey(activeKeyIndex, e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={() => testStreamKey(activeKeyIndex)}
                    disabled={isTestingKey || !streamKeys[activeKeyIndex]?.key}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isTestingKey ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : streamKeys[activeKeyIndex]?.isValid ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <TestTube className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {streamKeys[activeKeyIndex]?.lastTested && (
                  <div className="text-xs text-gray-400 mt-1">
                    Last tested: {streamKeys[activeKeyIndex].lastTested?.toLocaleString()}
                    {streamKeys[activeKeyIndex]?.isValid ? (
                      <span className="text-green-400 ml-2">✓ Valid</span>
                    ) : (
                      <span className="text-red-400 ml-2">✗ Invalid</span>
                    )}
                  </div>
                )}
              </div>

              {/* Audio Controls */}
              <div className="grid grid-cols-1 gap-4">
                {/* Microphone */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="h-4 w-4 text-orange-400" />
                      <span className="text-sm">Microphone</span>
                      <Switch checked={!micMuted} onCheckedChange={(checked) => setMicMuted(!checked)} />
                    </div>
                    <span className="text-sm text-gray-400">{micVolume[0]}%</span>
                  </div>
                  <Slider
                    value={micVolume}
                    onValueChange={setMicVolume}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={micMuted}
                  />
                </div>

                {/* Headset */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Headphones className="h-4 w-4 text-blue-400" />
                      <span className="text-sm">Headset</span>
                      <Switch checked={!headsetMuted} onCheckedChange={(checked) => setHeadsetMuted(!checked)} />
                    </div>
                    <span className="text-sm text-gray-400">{headsetVolume[0]}%</span>
                  </div>
                  <Slider
                    value={headsetVolume}
                    onValueChange={setHeadsetVolume}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={headsetMuted}
                  />
                </div>

                {/* Output Volume */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-green-400" />
                      <span className="text-sm">Output</span>
                    </div>
                    <span className="text-sm text-gray-400">{outputVolume[0]}%</span>
                  </div>
                  <Slider value={outputVolume} onValueChange={setOutputVolume} max={100} step={1} className="w-full" />
                </div>
              </div>

              {/* Stream Quality Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Quality</label>
                  <select
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                    value={streamQuality}
                    onChange={(e) => setStreamQuality(e.target.value)}
                  >
                    <option value="720p30">720p @ 30fps</option>
                    <option value="720p60">720p @ 60fps</option>
                    <option value="1080p30">1080p @ 30fps</option>
                    <option value="1080p60">1080p @ 60fps</option>
                    <option value="1440p30">1440p @ 30fps</option>
                    <option value="1440p60">1440p @ 60fps</option>
                    <option value="4k30">4K @ 30fps</option>
                    <option value="4k60">4K @ 60fps</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">FPS</label>
                  <select
                    className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                  >
                    <option value={30}>30 FPS</option>
                    <option value={60}>60 FPS</option>
                    <option value={120}>120 FPS</option>
                  </select>
                </div>
              </div>

              {/* Bitrate Control */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Bitrate</label>
                  <span className="text-sm text-gray-400">{bitrate[0]} kbps</span>
                </div>
                <Slider
                  value={bitrate}
                  onValueChange={setBitrate}
                  min={1000}
                  max={15000}
                  step={100}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Chat - SCALES WITH WINDOW */}
        <div
          className="w-full lg:w-80 flex flex-col border-l-2 min-h-0 overflow-hidden"
          style={{ borderColor: `${platform.color}40` }}
        >
          {/* Chat Header */}
          <div className="p-3 border-b flex-shrink-0" style={{ borderColor: `${platform.color}40` }}>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Live Chat</h4>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="h-4 w-4" />
                <span>{liveStats.viewers}</span>
              </div>
            </div>
          </div>

          {/* Chat Messages - SCROLLABLE WITH AUTO-SCROLL */}
          <div
            ref={chatMessagesRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0"
            style={{
              maxHeight: "400px",
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-sm animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-medium text-sm"
                    style={{
                      color:
                        msg.type === "bot"
                          ? "#22c55e"
                          : msg.type === "mod"
                            ? "#f59e0b"
                            : msg.type === "self"
                              ? platform.color
                              : "#94a3b8",
                    }}
                  >
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <div className="text-gray-300 leading-relaxed">{msg.message}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t flex-shrink-0" style={{ borderColor: `${platform.color}40` }}>
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button onClick={sendMessage} style={{ backgroundColor: platform.color }} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
