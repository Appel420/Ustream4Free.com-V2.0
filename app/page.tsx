"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Play,
  Square,
  Settings,
  BarChart3,
  Monitor,
  Smartphone,
  Tablet,
  Heart,
  Music,
  MessageCircle,
  Mic,
  Camera,
  Users,
  Plus,
  Server,
  Shield,
} from "lucide-react"
import { ResizablePopupWindow } from "@/components/resizable-popup-window"
import { PlatformChatWindow } from "@/components/platform-chat-window"
import { StreamDeck } from "@/components/stream-deck"
import { PlaylistManager } from "@/components/playlist-manager"
import { MultistreamServer } from "@/components/multistream-server"
import { AddPlatformModal } from "@/components/add-platform-modal"
import { UserLogin } from "@/components/user-login"
import { AdminPanel } from "@/components/admin-panel"

// Define stream key interface
interface StreamKey {
  id: string
  name: string
  key: string
  isActive: boolean
  isValid: boolean
  lastTested: Date | null
}

// Define platform types with stream keys
interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl: string
  color: string
  isActive: boolean
  quality: string
  viewers: number
  streamKeys: StreamKey[]
  activeKeyIndex: number
  connectionStatus: "connected" | "disconnected" | "connecting" | "error"
  uptime: number
  bitrate: number
  fps: number
  oauth: {
    clientId: string
    authUrl: string
    tokenUrl: string
    scopes: string[]
    redirectUri: string
  }
  api: {
    baseUrl: string
    streamEndpoint: string
    chatEndpoint?: string
  }
}

// Define popup window types
interface PopupWindow {
  id: string
  type:
    | "chat"
    | "stream"
    | "video"
    | "music"
    | "settings"
    | "deck"
    | "playlist"
    | "api"
    | "multistream"
    | "ai"
    | "admin"
  platformId?: string
  isOpen: boolean
}

export default function Ustream4Free() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [deviceType, setDeviceType] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showDonateModal, setShowDonateModal] = useState(false)
  const [showAddPlatform, setShowAddPlatform] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [viewMode, setViewMode] = useState("user") // "user" or "admin"

  // Create default stream keys for each platform
  const createDefaultStreamKeys = (): StreamKey[] => [
    { id: "primary", name: "Primary Stream Key", key: "", isActive: true, isValid: false, lastTested: null },
    { id: "backup", name: "Backup Stream Key", key: "", isActive: false, isValid: false, lastTested: null },
    { id: "mobile", name: "Mobile Stream Key", key: "", isActive: false, isValid: false, lastTested: null },
    { id: "guest", name: "Guest Stream Key", key: "", isActive: false, isValid: false, lastTested: null },
    { id: "event", name: "Event Stream Key", key: "", isActive: false, isValid: false, lastTested: null },
  ]

  // Platforms state with stream keys and REAL LOGOS
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "twitch",
      name: "twitch",
      displayName: "Twitch",
      logo: "🟣",
      logoUrl: "/logos/twitch-logo.jpeg",
      color: "#9146FF",
      isActive: true,
      quality: "1080p60",
      viewers: 1247,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 6000,
      fps: 60,
      oauth: {
        clientId: "your_twitch_client_id",
        authUrl: "https://id.twitch.tv/oauth2/authorize",
        tokenUrl: "https://id.twitch.tv/oauth2/token",
        scopes: ["channel:read:stream_key", "chat:read", "chat:edit", "channel:manage:broadcast"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://api.twitch.tv/helix",
        streamEndpoint: "rtmp://live.twitch.tv/live",
        chatEndpoint: "wss://irc-ws.chat.twitch.tv:443",
      },
    },
    {
      id: "youtube",
      name: "youtube",
      displayName: "YouTube",
      logo: "🔴",
      logoUrl: "/logos/youtube-logo.jpeg",
      color: "#FF0000",
      isActive: true,
      quality: "1440p30",
      viewers: 856,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 8000,
      fps: 30,
      oauth: {
        clientId: "your_youtube_client_id",
        authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
        tokenUrl: "https://oauth2.googleapis.com/token",
        scopes: ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.force-ssl"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://www.googleapis.com/youtube/v3",
        streamEndpoint: "rtmp://a.rtmp.youtube.com/live2",
        chatEndpoint: "https://www.googleapis.com/youtube/v3/liveChat/messages",
      },
    },
    {
      id: "x",
      name: "x",
      displayName: "Twitter/X",
      logo: "🐦",
      logoUrl: "/logos/x-logo.png",
      color: "#000000",
      isActive: true,
      quality: "720p30",
      viewers: 432,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 3000,
      fps: 30,
      oauth: {
        clientId: "your_x_client_id",
        authUrl: "https://twitter.com/i/oauth2/authorize",
        tokenUrl: "https://api.twitter.com/2/oauth2/token",
        scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://api.twitter.com/2",
        streamEndpoint: "https://prod-fastly-us-west-2.video.pscp.tv/Transcoding/v1/hls",
      },
    },
    {
      id: "facebook",
      name: "facebook",
      displayName: "Facebook",
      logo: "🔵",
      logoUrl: "/logos/facebook-logo.png",
      color: "#1877F2",
      isActive: false,
      quality: "720p30",
      viewers: 0,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 4000,
      fps: 30,
      oauth: {
        clientId: "your_facebook_client_id",
        authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
        tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
        scopes: ["publish_video", "pages_show_list", "pages_read_engagement"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://graph.facebook.com/v18.0",
        streamEndpoint: "rtmp://live-api-s.facebook.com:80/rtmp",
      },
    },
    {
      id: "instagram",
      name: "instagram",
      displayName: "Instagram",
      logo: "📷",
      logoUrl: "/logos/instagram-logo.jpeg",
      color: "#E4405F",
      isActive: true,
      quality: "1080p30",
      viewers: 623,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 3500,
      fps: 30,
      oauth: {
        clientId: "your_instagram_client_id",
        authUrl: "https://api.instagram.com/oauth/authorize",
        tokenUrl: "https://api.instagram.com/oauth/access_token",
        scopes: ["instagram_basic", "instagram_content_publish"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://graph.instagram.com",
        streamEndpoint: "rtmp://live-upload.instagram.com/rtmp",
      },
    },
    {
      id: "tiktok",
      name: "tiktok",
      displayName: "TikTok",
      logo: "🎵",
      logoUrl: "/logos/tiktok-logo.png",
      color: "#000000",
      isActive: true,
      quality: "4k30",
      viewers: 1893,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 12000,
      fps: 30,
      oauth: {
        clientId: "your_tiktok_client_id",
        authUrl: "https://www.tiktok.com/auth/authorize/",
        tokenUrl: "https://open-api.tiktok.com/oauth/access_token/",
        scopes: ["video.upload", "user.info.basic"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://open-api.tiktok.com",
        streamEndpoint: "rtmp://push.tiktokcdn.com/live",
        chatEndpoint: "wss://webcast.tiktok.com/webcast/im/fetch",
      },
    },
    {
      id: "kick",
      name: "kick",
      displayName: "Kick",
      logo: "🟢",
      logoUrl: "/logos/kick-logo.png",
      color: "#53FC18",
      isActive: false,
      quality: "720p30",
      viewers: 0,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: 3500,
      fps: 30,
      oauth: {
        clientId: "your_kick_client_id",
        authUrl: "https://kick.com/oauth2/authorize",
        tokenUrl: "https://kick.com/api/v2/oauth/token",
        scopes: ["streaming", "chat"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: "https://kick.com/api/v2",
        streamEndpoint: "rtmp://ingest.kick.com/live",
        chatEndpoint: "wss://ws-us2.pusher.app/app/32cbd69e4b950bf97679",
      },
    },
  ])

  // Popup windows state
  const [popupWindows, setPopupWindows] = useState<PopupWindow[]>([
    { id: "multistream-server", type: "multistream", isOpen: false },
    { id: "stream-deck", type: "deck", isOpen: false },
    { id: "playlist-manager", type: "playlist", isOpen: false },
    { id: "twitch-chat", type: "chat", platformId: "twitch", isOpen: false },
    { id: "youtube-chat", type: "chat", platformId: "youtube", isOpen: false },
    { id: "x-chat", type: "chat", platformId: "x", isOpen: false },
    { id: "facebook-chat", type: "chat", platformId: "facebook", isOpen: false },
    { id: "instagram-chat", type: "chat", platformId: "instagram", isOpen: false },
    { id: "tiktok-chat", type: "chat", platformId: "tiktok", isOpen: false },
    { id: "kick-chat", type: "chat", platformId: "kick", isOpen: false },
    { id: "music-player", type: "music", isOpen: false },
    { id: "video-player", type: "video", isOpen: false },
    { id: "settings", type: "settings", isOpen: false },
    { id: "admin-panel", type: "admin", isOpen: false },
  ])

  // Check for login status on load
  useEffect(() => {
    const userAccess = sessionStorage.getItem("userAccess")
    const adminAccess = sessionStorage.getItem("adminAccess")
    const storedViewMode = sessionStorage.getItem("viewMode")

    if (userAccess === "true") {
      setIsLoggedIn(true)

      if (adminAccess === "true") {
        setIsAdmin(true)
        setViewMode(storedViewMode || "user")
      }
    } else {
      // Show login after a short delay
      setTimeout(() => {
        setShowLogin(true)
      }, 500)
    }
  }, [])

  // Update platform function
  const updatePlatform = (platformId: string, updates: Partial<Platform>) => {
    setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, ...updates } : p)))
  }

  // Add platform function
  const addPlatform = (newPlatformData: any) => {
    const newPlatform: Platform = {
      id: newPlatformData.id,
      name: newPlatformData.name,
      displayName: newPlatformData.displayName,
      logo: newPlatformData.logo,
      logoUrl: newPlatformData.logoUrl,
      color: newPlatformData.color,
      isActive: false,
      quality: newPlatformData.maxResolution,
      viewers: 0,
      streamKeys: createDefaultStreamKeys(),
      activeKeyIndex: 0,
      connectionStatus: "disconnected",
      uptime: 0,
      bitrate: newPlatformData.maxBitrate,
      fps: 30,
      oauth: {
        clientId: `your_${newPlatformData.name}_client_id`,
        authUrl: `https://${newPlatformData.name}.com/oauth/authorize`,
        tokenUrl: `https://${newPlatformData.name}.com/oauth/token`,
        scopes: ["stream", "chat"],
        redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
      },
      api: {
        baseUrl: `https://api.${newPlatformData.name}.com`,
        streamEndpoint: newPlatformData.streamEndpoint,
        chatEndpoint: `wss://chat.${newPlatformData.name}.com`,
      },
    }

    setPlatforms((prev) => [...prev, newPlatform])
  }

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())

      if (isStreaming) {
        setPlatforms((prev) =>
          prev.map((platform) =>
            platform.isActive && platform.connectionStatus === "connected"
              ? {
                  ...platform,
                  viewers: Math.max(0, platform.viewers + Math.floor(Math.random() * 10 - 5)),
                }
              : platform,
          ),
        )
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isStreaming])

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      if (width < 768) setDeviceType("mobile")
      else if (width < 1024) setDeviceType("tablet")
      else setDeviceType("desktop")
    }

    checkDevice()
    window.addEventListener("resize", checkDevice)
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  const toggleStreaming = () => {
    setIsStreaming(!isStreaming)
  }

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const openPopupWindow = (id: string) => {
    setPopupWindows((windows) => windows.map((w) => (w.id === id ? { ...w, isOpen: true } : w)))
  }

  const closePopupWindow = (id: string) => {
    setPopupWindows((windows) => windows.map((w) => (w.id === id ? { ...w, isOpen: false } : w)))
  }

  const getTotalViewers = () => {
    return platforms.reduce((sum, platform) => (platform.isActive ? sum + platform.viewers : sum), 0)
  }

  // Playlist functions
  const playIntro = () => {
    console.log("Playing intro video...")
  }

  const playBRB = () => {
    console.log("Showing BRB screen...")
  }

  const playOutro = () => {
    console.log("Playing outro video...")
  }

  // Login handlers
  const handleLoginSuccess = (isAdminUser: boolean) => {
    setShowLogin(false)
    setIsLoggedIn(true)
    setIsAdmin(isAdminUser)

    // If admin user, open admin panel based on view mode preference
    if (isAdminUser && viewMode === "admin") {
      openPopupWindow("admin-panel")
    }
  }

  const handleLoginFail = () => {
    // Just keep the login modal open
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsAdmin(false)
    closePopupWindow("admin-panel")
    setShowLogin(true)
  }

  const toggleViewMode = () => {
    const newMode = viewMode === "user" ? "admin" : "user"
    setViewMode(newMode)
    sessionStorage.setItem("viewMode", newMode)

    // If switching to admin mode, open admin panel
    if (newMode === "admin") {
      openPopupWindow("admin-panel")
    } else {
      closePopupWindow("admin-panel")
    }
  }

  // Secret key combination to show login (Ctrl+Shift+L)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "L") {
        if (!isLoggedIn) {
          setShowLogin(true)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        {showLogin && (
          <div className="w-full max-w-md p-4">
            <UserLogin onLoginSuccess={handleLoginSuccess} onLoginFail={handleLoginFail} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Pattern */}
      <div
        className="fixed inset-0 opacity-30 z-0"
        style={{
          backgroundImage: `url('/placeholder.svg?height=1080&width=1920')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Dark overlay to prevent bleed-through */}
      <div className="fixed inset-0 bg-black/70 z-0"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Ustream4Free.com
              </h1>
              <Badge variant={isStreaming ? "destructive" : "secondary"} className="text-sm">
                {isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}
              </Badge>
              {isAdmin && viewMode === "admin" && (
                <Badge variant="outline" className="bg-purple-900/50 text-purple-300 border-purple-500">
                  <Shield className="h-3 w-3 mr-1" />
                  ADMIN
                </Badge>
              )}
            </div>

            {/* Device Indicator & Stats */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{getTotalViewers().toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  {deviceType === "desktop" && <Monitor className="h-4 w-4" />}
                  {deviceType === "tablet" && <Tablet className="h-4 w-4" />}
                  {deviceType === "mobile" && <Smartphone className="h-4 w-4" />}
                  <span className="capitalize hidden sm:inline">{deviceType}</span>
                </div>
                <div className="text-xs text-gray-400 hidden sm:block">{currentTime.toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 mt-3 overflow-x-auto pb-2">
            {/* Multistream Server */}
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => openPopupWindow("multistream-server")}
            >
              <Server className="h-4 w-4 mr-1" />
              Multistream Server
            </Button>

            {/* Stream Deck */}
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => openPopupWindow("stream-deck")}
            >
              <Settings className="h-4 w-4 mr-1" />
              Stream Deck (50)
            </Button>

            {/* Playlist Manager */}
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => openPopupWindow("playlist-manager")}
            >
              <Music className="h-4 w-4 mr-1" />
              Playlist Manager
            </Button>

            {/* Stream Control */}
            <Button
              size="sm"
              onClick={toggleStreaming}
              className={
                isStreaming ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
              }
            >
              {isStreaming ? <Square className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
              {isStreaming ? "Stop Streaming" : "Start Streaming"}
            </Button>

            {/* Quick Actions */}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={playIntro}>
              <Play className="h-4 w-4 mr-1" />
              Play Intro
            </Button>

            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white" onClick={playBRB}>
              <MessageCircle className="h-4 w-4 mr-1" />
              BRB Screen
            </Button>

            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" onClick={playOutro}>
              <Square className="h-4 w-4 mr-1" />
              Play Outro
            </Button>

            {/* Other Controls */}
            <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Mic className="h-4 w-4 mr-1" />
              Microphone
            </Button>

            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
              <Camera className="h-4 w-4 mr-1" />
              Camera
            </Button>

            <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </Button>

            <Button
              size="sm"
              className="bg-gray-600 hover:bg-gray-700 text-white"
              onClick={() => openPopupWindow("settings")}
            >
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>

            {/* Admin Panel Button - Only visible for admin in admin mode */}
            {isAdmin && viewMode === "admin" && (
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => openPopupWindow("admin-panel")}
              >
                <Shield className="h-4 w-4 mr-1" />
                Admin Panel
              </Button>
            )}

            {/* View Mode Toggle - Only visible for admin */}
            {isAdmin && (
              <Button size="sm" variant="outline" className="ml-auto" onClick={toggleViewMode}>
                {viewMode === "admin" ? "View as User" : "Admin Mode"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 p-4 pb-20 overflow-y-auto" style={{ minHeight: "calc(100vh - 120px)" }}>
        {/* Platform Cards */}
        <div className="space-y-2 mb-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className="rounded-lg p-4 flex items-center justify-between"
              style={{
                backgroundColor: platform.isActive ? `${platform.color}20` : "transparent",
                border: `2px solid ${platform.isActive ? platform.color : "#333"}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={platform.logoUrl || "/placeholder.svg"}
                    alt={platform.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
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
                </div>
                <div>
                  <div className="text-xl font-medium text-white">{platform.displayName}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={`w-2 h-2 rounded-full ${platform.connectionStatus === "connected" ? "bg-green-500" : platform.isActive ? "bg-yellow-500" : "bg-gray-500"}`}
                    ></div>
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor: platform.color,
                        color: platform.color,
                      }}
                    >
                      {platform.quality}
                    </Badge>
                    {platform.isActive && (
                      <Badge variant="outline" className="text-xs text-green-400 border-green-400">
                        {platform.viewers} viewers
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs text-blue-400 border-blue-400">
                      Keys: {platform.streamKeys.filter((k) => k.key).length}/5
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => {
                  const windowId = `${platform.id}-chat`
                  const existingWindow = popupWindows.find((w) => w.id === windowId)

                  if (existingWindow) {
                    openPopupWindow(windowId)
                  } else {
                    setPopupWindows([
                      ...popupWindows,
                      { id: windowId, type: "chat", platformId: platform.id, isOpen: true },
                    ])
                  }
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Pop Out
              </Button>
            </div>
          ))}

          {/* Add Platform Button */}
          <Button className="w-full bg-green-600 hover:bg-green-700 mt-2" onClick={() => setShowAddPlatform(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Platform
          </Button>
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Mobile optimized interface active</span>
            </div>
          </div>
        </div>
      </main>

      {/* Add Platform Modal */}
      <AddPlatformModal
        isOpen={showAddPlatform}
        onClose={() => setShowAddPlatform(false)}
        onAddPlatform={addPlatform}
        existingPlatforms={platforms.map((p) => p.id)}
      />

      {/* Popup Windows */}
      {popupWindows.map((window) => {
        if (!window.isOpen) return null

        const platform = window.platformId ? platforms.find((p) => p.id === window.platformId) : null

        let content
        let title
        let color

        if (window.type === "chat" && platform) {
          title = `${platform.displayName} Chat & Video`
          color = platform.color
          content = <PlatformChatWindow platform={platform} viewerCount={platform.viewers} />
        } else if (window.type === "deck") {
          title = "Stream Deck Pro"
          color = "#9C27B0"
          content = (
            <StreamDeck
              isStreaming={isStreaming}
              onToggleStream={toggleStreaming}
              onPlayIntro={playIntro}
              onPlayBRB={playBRB}
              onPlayOutro={playOutro}
            />
          )
        } else if (window.type === "playlist") {
          title = "Playlist Manager"
          color = "#4CAF50"
          content = <PlaylistManager onPlayIntro={playIntro} onPlayBRB={playBRB} onPlayOutro={playOutro} />
        } else if (window.type === "multistream") {
          title = "Multistream Server"
          color = "#EF4444"
          content = (
            <MultistreamServer
              platforms={platforms}
              onUpdatePlatform={updatePlatform}
              isStreaming={isStreaming}
              onToggleStreaming={toggleStreaming}
            />
          )
        } else if (window.type === "admin") {
          title = "Management Console"
          color = "#9333EA"
          content = <AdminPanel onLogout={handleLogout} onToggleViewMode={toggleViewMode} viewMode={viewMode} />
        } else {
          title = "Window"
          color = "#2196F3"
          content = <div className="p-4">Content for {window.type}</div>
        }

        return (
          <ResizablePopupWindow
            key={window.id}
            id={window.id}
            title={title}
            isOpen={window.isOpen}
            onClose={() => closePopupWindow(window.id)}
            color={color}
            initialWidth={
              window.type === "chat"
                ? 600
                : window.type === "deck"
                  ? 800
                  : window.type === "multistream"
                    ? 1000
                    : window.type === "admin"
                      ? 1200
                      : 500
            }
            initialHeight={
              window.type === "chat"
                ? 600
                : window.type === "deck"
                  ? 500
                  : window.type === "multistream"
                    ? 700
                    : window.type === "admin"
                      ? 800
                      : 400
            }
            initialX={Math.random() * 100 + 50}
            initialY={Math.random() * 100 + 50}
          >
            {content}
          </ResizablePopupWindow>
        )
      })}

      {/* Support Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={() => setShowDonateModal(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg text-white"
        >
          <Heart className="h-4 w-4 mr-2" />
          Support Project
        </Button>
      </div>
    </div>
  )
}
