"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  ExternalLink,
  Eye,
  MessageCircle,
  Heart,
  DollarSign,
  Settings,
  Plus,
  Trash2,
  Volume2,
  Camera,
  Mic,
} from "lucide-react"
import { ALL_STREAMING_PLATFORMS, type StreamingPlatform } from "@/lib/comprehensive-platforms"

interface StreamKey {
  id: string
  name: string
  key: string
  isActive: boolean
}

interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl?: string
  color: string
  isActive: boolean
  viewers: number
  chatMessages: number
  followers: number
  donations: number
  streamKeys: StreamKey[]
  activeKeyIndex: number
  audioSettings: {
    micEnabled: boolean
    micVolume: number
    outputEnabled: boolean
    outputVolume: number
  }
  videoSettings: {
    webcamEnabled: boolean
    webcamQuality: string
    streamQuality: string
    bitrate: number
    fps: number
  }
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
  features: {
    liveStreaming: boolean
    chat: boolean
    analytics: boolean
    multistream: boolean
  }
  limits: {
    maxBitrate: number
    maxResolution: string
  }
}

interface ComprehensiveStreamingDashboardProps {
  isStreaming: boolean
  setActiveStreams: (count: number) => void
  setTotalViewers: (count: number) => void
}

export function ComprehensiveStreamingDashboard({
  isStreaming,
  setActiveStreams,
  setTotalViewers,
}: ComprehensiveStreamingDashboardProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [popoutWindows, setPopoutWindows] = useState<Map<string, Window>>(new Map())
  const [showAddPlatform, setShowAddPlatform] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("major")

  // Initialize with major platforms
  useEffect(() => {
    const majorPlatforms = ALL_STREAMING_PLATFORMS.filter((p) => p.category === "major").map((platformConfig) => ({
      id: platformConfig.id,
      name: platformConfig.name,
      displayName: platformConfig.displayName,
      logo: platformConfig.logo,
      logoUrl: platformConfig.logoUrl,
      color: platformConfig.color,
      isActive: false,
      viewers: Math.floor(Math.random() * 2000),
      chatMessages: Math.floor(Math.random() * 100),
      followers: Math.floor(Math.random() * 50000),
      donations: Math.floor(Math.random() * 500),
      streamKeys: [
        { id: "key1", name: "Primary Key", key: "", isActive: true },
        { id: "key2", name: "Backup Key", key: "", isActive: false },
        { id: "key3", name: "Mobile Key", key: "", isActive: false },
        { id: "key4", name: "Guest Key", key: "", isActive: false },
        { id: "key5", name: "Event Key", key: "", isActive: false },
      ],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 80,
        outputEnabled: true,
        outputVolume: 75,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "1080p30",
        streamQuality: "1080p60",
        bitrate: platformConfig.limits.maxBitrate,
        fps: 60,
      },
      oauth: platformConfig.oauth,
      api: platformConfig.api,
      features: platformConfig.features,
      limits: platformConfig.limits,
    }))

    setPlatforms(majorPlatforms)
  }, [])

  // Update stats
  useEffect(() => {
    const activeCount = platforms.filter((p) => p.isActive).length
    const totalViewers = platforms.reduce((sum, p) => (p.isActive ? sum + p.viewers : sum), 0)

    setActiveStreams(activeCount)
    setTotalViewers(totalViewers)
  }, [platforms, setActiveStreams, setTotalViewers])

  // Real-time updates
  useEffect(() => {
    if (!isStreaming) return

    const interval = setInterval(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.isActive
            ? {
                ...p,
                viewers: Math.max(0, p.viewers + Math.floor(Math.random() * 20 - 10)),
                chatMessages: p.chatMessages + Math.floor(Math.random() * 5),
                donations: p.donations + (Math.random() > 0.9 ? Math.random() * 50 : 0),
              }
            : p,
        ),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [isStreaming])

  const togglePlatform = (platformId: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, isActive: !p.isActive } : p)))
  }

  const addPlatform = (platformConfig: StreamingPlatform) => {
    // Check if platform already exists
    if (platforms.find((p) => p.id === platformConfig.id)) {
      console.log("Platform already exists")
      return
    }

    const newPlatform: Platform = {
      id: platformConfig.id,
      name: platformConfig.name,
      displayName: platformConfig.displayName,
      logo: platformConfig.logo,
      logoUrl: platformConfig.logoUrl,
      color: platformConfig.color,
      isActive: false,
      viewers: 0,
      chatMessages: 0,
      followers: Math.floor(Math.random() * 10000),
      donations: 0,
      streamKeys: [
        { id: "key1", name: "Primary Key", key: "", isActive: true },
        { id: "key2", name: "Backup Key", key: "", isActive: false },
        { id: "key3", name: "Mobile Key", key: "", isActive: false },
        { id: "key4", name: "Guest Key", key: "", isActive: false },
        { id: "key5", name: "Event Key", key: "", isActive: false },
      ],
      activeKeyIndex: 0,
      audioSettings: {
        micEnabled: true,
        micVolume: 80,
        outputEnabled: true,
        outputVolume: 75,
      },
      videoSettings: {
        webcamEnabled: true,
        webcamQuality: "1080p30",
        streamQuality: platformConfig.limits.maxResolution,
        bitrate: platformConfig.limits.maxBitrate,
        fps: 60,
      },
      oauth: platformConfig.oauth,
      api: platformConfig.api,
      features: platformConfig.features,
      limits: platformConfig.limits,
    }

    setPlatforms((prev) => [...prev, newPlatform])
    setShowAddPlatform(false)
  }

  const removePlatform = (platformId: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== platformId))

    // Close any open popout windows
    const popup = popoutWindows.get(platformId)
    if (popup && !popup.closed) {
      popup.close()
    }
    setPopoutWindows((prev) => {
      const newMap = new Map(prev)
      newMap.delete(platformId)
      return newMap
    })
  }

  const updateStreamKey = (platformId: string, keyIndex: number, newKey: string) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              streamKeys: p.streamKeys.map((key, index) => (index === keyIndex ? { ...key, key: newKey } : key)),
            }
          : p,
      ),
    )
  }

  const setActiveKey = (platformId: string, keyIndex: number) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              activeKeyIndex: keyIndex,
              streamKeys: p.streamKeys.map((key, index) => ({
                ...key,
                isActive: index === keyIndex,
              })),
            }
          : p,
      ),
    )
  }

  const updateAudioSettings = (platformId: string, settings: Partial<Platform["audioSettings"]>) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              audioSettings: { ...p.audioSettings, ...settings },
            }
          : p,
      ),
    )
  }

  const updateVideoSettings = (platformId: string, settings: Partial<Platform["videoSettings"]>) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === platformId
          ? {
              ...p,
              videoSettings: { ...p.videoSettings, ...settings },
            }
          : p,
      ),
    )
  }

  const popOutStream = (platform: Platform) => {
    const existingPopup = popoutWindows.get(platform.id)
    if (existingPopup && !existingPopup.closed) {
      existingPopup.focus()
      return
    }

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const width = isMobile ? window.innerWidth : 1400
    const height = isMobile ? window.innerHeight : 900
    const left = isMobile ? 0 : Math.max(0, (screen.width - width) / 2)
    const top = isMobile ? 0 : Math.max(0, (screen.height - height) / 2)

    const popup = window.open(
      "",
      `${platform.id}-ustream4free-pro`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`,
    )

    if (popup) {
      setPopoutWindows((prev) => new Map(prev.set(platform.id, popup)))

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
          <title>${platform.displayName} Stream - Ustream4Free Pro</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%);
              color: #fff;
              height: 100vh;
              overflow: hidden;
              user-select: none;
              touch-action: manipulation;
            }
            
            .window-header {
              background: linear-gradient(135deg, ${platform.color}20 0%, rgba(0,0,0,0.95) 100%);
              padding: 12px 20px;
              border-bottom: 2px solid ${platform.color}40;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: move;
              position: relative;
              backdrop-filter: blur(20px);
              box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            }
            
            .window-header:active { cursor: grabbing; }
            
            .window-controls {
              display: flex;
              gap: 8px;
              align-items: center;
            }
            
            .control-dot {
              width: 16px;
              height: 16px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.3s;
              border: 2px solid rgba(255,255,255,0.3);
              position: relative;
              overflow: hidden;
            }
            
            .control-dot::before {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 50%;
              background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2));
              opacity: 0;
              transition: opacity 0.3s;
            }
            
            .control-dot:hover::before { opacity: 1; }
            .control-dot:hover { transform: scale(1.2); box-shadow: 0 0 15px currentColor; }
            
            .control-dot.close { background: linear-gradient(135deg, #ff5f57, #ff3b30); }
            .control-dot.minimize { background: linear-gradient(135deg, #ffbd2e, #ff9500); }
            .control-dot.maximize { background: linear-gradient(135deg, #28ca42, #30d158); }
            
            .platform-info {
              display: flex;
              align-items: center;
              gap: 20px;
              flex: 1;
              justify-content: center;
            }
            
            .platform-logo {
              width: 40px;
              height: 40px;
              border-radius: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, ${platform.color}40, ${platform.color}20);
              border: 2px solid ${platform.color}60;
              box-shadow: 0 0 20px ${platform.color}30;
            }
            
            .platform-name { 
              font-size: 24px; 
              font-weight: bold; 
              color: ${platform.color};
              text-shadow: 0 0 10px ${platform.color}40;
            }
            
            .live-badge {
              background: linear-gradient(45deg, #ef4444, #dc2626);
              padding: 6px 16px;
              border-radius: 25px;
              font-size: 14px;
              font-weight: bold;
              animation: pulse 2s infinite;
              box-shadow: 0 0 25px #ef444460;
              border: 2px solid #ef444480;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
            
            .container {
              display: grid;
              grid-template-columns: 2fr 1fr;
              height: calc(100vh - 80px);
              gap: 2px;
              background: #333;
              position: relative;
            }
            
            .video-section {
              background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
              display: flex;
              flex-direction: column;
              position: relative;
              border: 2px solid ${platform.color}20;
              border-radius: 12px;
              overflow: hidden;
            }
            
            .video-content {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
              background: radial-gradient(circle at center, ${platform.color}05 0%, transparent 70%);
            }
            
            .platform-display {
              text-align: center;
              padding: 60px;
            }
            
            .platform-display .logo {
              font-size: 120px;
              margin-bottom: 30px;
              filter: drop-shadow(0 0 30px ${platform.color}60);
              animation: float 3s ease-in-out infinite;
            }
            
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            
            .platform-display .name {
              font-size: 42px;
              font-weight: bold;
              color: ${platform.color};
              margin-bottom: 15px;
              text-shadow: 0 0 20px ${platform.color}40;
            }
            
            .platform-display .status {
              font-size: 24px;
              color: #22c55e;
              margin-bottom: 30px;
              text-shadow: 0 0 10px #22c55e40;
            }
            
            .platform-display .info {
              font-size: 16px;
              color: #888;
              line-height: 1.8;
              max-width: 400px;
              margin: 0 auto;
            }
            
            .video-overlay {
              position: absolute;
              bottom: 30px;
              left: 30px;
              right: 30px;
              background: rgba(0,0,0,0.95);
              padding: 25px;
              border-radius: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border: 2px solid ${platform.color}40;
              backdrop-filter: blur(20px);
              box-shadow: 0 10px 40px rgba(0,0,0,0.8);
            }
            
            .stream-info {
              flex: 1;
            }
            
            .stream-title {
              font-size: 18px;
              font-weight: bold;
              color: ${platform.color};
              margin-bottom: 8px;
            }
            
            .stream-stats {
              font-size: 14px;
              color: #888;
              display: flex;
              gap: 20px;
              flex-wrap: wrap;
            }
            
            .controls {
              display: flex;
              gap: 15px;
              flex-wrap: wrap;
            }
            
            .control-btn {
              padding: 12px 24px;
              background: linear-gradient(135deg, ${platform.color} 0%, ${platform.color}80 100%);
              border: none;
              border-radius: 12px;
              color: #fff;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              transition: all 0.3s;
              box-shadow: 0 6px 20px ${platform.color}40;
              border: 2px solid ${platform.color}60;
              position: relative;
              overflow: hidden;
            }
            
            .control-btn::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2));
              opacity: 0;
              transition: opacity 0.3s;
            }
            
            .control-btn:hover::before { opacity: 1; }
            .control-btn:hover { 
              transform: translateY(-3px); 
              box-shadow: 0 8px 30px ${platform.color}60;
            }
            
            .control-btn.active { 
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              box-shadow: 0 6px 20px #22c55e40;
              border-color: #22c55e60;
            }
            
            .chat-section {
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              display: flex;
              flex-direction: column;
              border: 2px solid ${platform.color}20;
              border-radius: 12px;
              overflow: hidden;
            }
            
            .chat-header {
              padding: 25px;
              border-bottom: 2px solid ${platform.color}40;
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: linear-gradient(135deg, ${platform.color}20 0%, transparent 100%);
              font-size: 18px;
            }
            
            .chat-messages {
              flex: 1;
              padding: 25px;
              overflow-y: auto;
              min-height: 0;
            }
            
            .chat-message {
              margin-bottom: 20px;
              padding: 15px 20px;
              background: linear-gradient(135deg, ${platform.color}10 0%, rgba(255,255,255,0.05) 100%);
              border-radius: 15px;
              font-size: 14px;
              line-height: 1.6;
              border-left: 4px solid ${platform.color};
              transition: all 0.3s;
              position: relative;
              overflow: hidden;
            }
            
            .chat-message::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05));
              opacity: 0;
              transition: opacity 0.3s;
            }
            
            .chat-message:hover::before { opacity: 1; }
            .chat-message:hover {
              background: linear-gradient(135deg, ${platform.color}20 0%, rgba(255,255,255,0.1) 100%);
              transform: translateX(8px);
            }
            
            .chat-input-area {
              padding: 25px;
              border-top: 2px solid ${platform.color}40;
              display: flex;
              gap: 15px;
              background: linear-gradient(135deg, ${platform.color}10 0%, transparent 100%);
            }
            
            .chat-input {
              flex: 1;
              padding: 18px 25px;
              border: 2px solid ${platform.color}40;
              border-radius: 30px;
              background: rgba(0,0,0,0.7);
              color: #fff;
              outline: none;
              font-size: 14px;
              transition: all 0.3s;
              backdrop-filter: blur(10px);
            }
            
            .chat-input:focus {
              border-color: ${platform.color};
              box-shadow: 0 0 25px ${platform.color}40;
              background: rgba(0,0,0,0.9);
            }
            
            .chat-input::placeholder { color: rgba(255,255,255,0.5); }
            
            .send-btn {
              padding: 18px 35px;
              background: linear-gradient(135deg, ${platform.color} 0%, ${platform.color}80 100%);
              border: none;
              border-radius: 30px;
              color: #fff;
              cursor: pointer;
              font-weight: bold;
              transition: all 0.3s;
              box-shadow: 0 6px 20px ${platform.color}40;
              border: 2px solid ${platform.color}60;
            }
            
            .send-btn:hover { 
              transform: translateY(-2px); 
              box-shadow: 0 8px 30px ${platform.color}60;
            }
            
            /* Resize handles - 8 directions */
            .resize-handle {
              position: absolute;
              background: transparent;
              z-index: 1000;
              transition: background 0.3s;
            }
            
            .resize-handle:hover {
              background: ${platform.color}60;
            }
            
            .resize-handle.n {
              top: 0; left: 20px; right: 20px; height: 10px;
              cursor: n-resize;
            }
            .resize-handle.ne {
              top: 0; right: 0; width: 25px; height: 25px;
              cursor: ne-resize;
              background: linear-gradient(-45deg, transparent 0%, transparent 35%, ${platform.color} 35%, ${platform.color} 65%, transparent 65%);
            }
            .resize-handle.e {
              right: 0; top: 20px; bottom: 20px; width: 10px;
              cursor: e-resize;
            }
            .resize-handle.se {
              bottom: 0; right: 0; width: 25px; height: 25px;
              cursor: se-resize;
              background: linear-gradient(45deg, transparent 0%, transparent 35%, ${platform.color} 35%, ${platform.color} 65%, transparent 65%);
            }
            .resize-handle.s {
              bottom: 0; left: 20px; right: 20px; height: 10px;
              cursor: s-resize;
            }
            .resize-handle.sw {
              bottom: 0; left: 0; width: 25px; height: 25px;
              cursor: sw-resize;
              background: linear-gradient(135deg, transparent 0%, transparent 35%, ${platform.color} 35%, ${platform.color} 65%, transparent 65%);
            }
            .resize-handle.w {
              left: 0; top: 20px; bottom: 20px; width: 10px;
              cursor: w-resize;
            }
            .resize-handle.nw {
              top: 0; left: 0; width: 25px; height: 25px;
              cursor: nw-resize;
              background: linear-gradient(-135deg, transparent 0%, transparent 35%, ${platform.color} 35%, ${platform.color} 65%, transparent 65%);
            }
            
            .position-info {
              position: absolute;
              top: 30px;
              left: 30px;
              background: rgba(0,0,0,0.95);
              padding: 15px 20px;
              border-radius: 15px;
              font-size: 12px;
              color: ${platform.color};
              border: 2px solid ${platform.color}40;
              backdrop-filter: blur(20px);
              box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            
            .quality-controls {
              position: absolute;
              top: 30px;
              right: 30px;
              background: rgba(0,0,0,0.95);
              padding: 15px 20px;
              border-radius: 15px;
              border: 2px solid ${platform.color}40;
              backdrop-filter: blur(20px);
              box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            
            .quality-select {
              background: rgba(0,0,0,0.8);
              border: 2px solid ${platform.color}40;
              color: #fff;
              padding: 8px 12px;
              border-radius: 8px;
              font-size: 12px;
              outline: none;
            }
            
            .quality-select:focus {
              border-color: ${platform.color};
              box-shadow: 0 0 10px ${platform.color}40;
            }
            
            .volume-controls {
              position: absolute;
              bottom: 120px;
              right: 30px;
              background: rgba(0,0,0,0.95);
              padding: 15px 20px;
              border-radius: 15px;
              border: 2px solid ${platform.color}40;
              backdrop-filter: blur(20px);
              display: flex;
              align-items: center;
              gap: 12px;
              box-shadow: 0 5px 20px rgba(0,0,0,0.5);
            }
            
            .volume-slider {
              width: 100px;
              height: 6px;
              border-radius: 3px;
              background: #333;
              outline: none;
              cursor: pointer;
            }
            
            .volume-slider::-webkit-slider-thumb {
              appearance: none;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: ${platform.color};
              cursor: pointer;
              box-shadow: 0 0 10px ${platform.color}60;
            }
            
            @media (max-width: 768px) {
              .container { 
                grid-template-columns: 1fr; 
                grid-template-rows: 2fr 1fr; 
              }
              .window-header { 
                flex-direction: column; 
                gap: 15px; 
                text-align: center; 
                padding: 20px;
              }
              .platform-display { padding: 30px; }
              .platform-display .logo { font-size: 80px; }
              .platform-display .name { font-size: 28px; }
              .video-overlay {
                flex-direction: column;
                gap: 20px;
                bottom: 15px;
                left: 15px;
                right: 15px;
                padding: 20px;
              }
              .controls {
                justify-content: center;
              }
              .control-btn {
                padding: 15px 20px;
                font-size: 16px;
              }
              .chat-header, .chat-messages, .chat-input-area {
                padding: 15px;
              }
              .position-info, .quality-controls, .volume-controls {
                position: relative;
                top: auto;
                left: auto;
                right: auto;
                bottom: auto;
                margin: 10px;
              }
            }
          </style>
        </head>
        <body>
          <div class="window-header" id="window-header">
            <div class="window-controls">
              <div class="control-dot close" onclick="window.close()" title="Close Window"></div>
              <div class="control-dot minimize" onclick="minimizeWindow()" title="Minimize"></div>
              <div class="control-dot maximize" onclick="toggleMaximize()" title="Maximize"></div>
            </div>
            <div class="platform-info">
              <div class="platform-logo">
                ${
                  platform.logoUrl
                    ? `<img src="${platform.logoUrl}" alt="${platform.displayName}" style="width: 32px; height: 32px; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                   <span style="display: none; font-size: 24px;">${platform.logo}</span>`
                    : `<span style="font-size: 24px;">${platform.logo}</span>`
                }
              </div>
              <span class="platform-name">${platform.displayName}</span>
              <span class="live-badge">● LIVE STREAM</span>
              <span style="font-size: 14px; color: #888;">Ustream4Free Pro</span>
            </div>
            <div style="width: 150px;"></div>
          </div>
          
          <div class="container" id="container">
            <div class="video-section">
              <div class="video-content">
                <div class="position-info" id="position-info">
                  Position: <span id="pos-x">0</span>, <span id="pos-y">0</span><br>
                  Size: <span id="size-w">${width}</span> × <span id="size-h">${height}</span><br>
                  Stream: ${platform.limits.maxResolution} @ ${platform.limits.maxBitrate}kbps
                </div>
                
                <div class="quality-controls">
                  <div style="margin-bottom: 8px; font-size: 12px; color: ${platform.color};">Stream Quality:</div>
                  <select class="quality-select" id="quality-select">
                    <option value="720p30">720p @ 30fps</option>
                    <option value="1080p30">1080p @ 30fps</option>
                    <option value="1080p60" selected>1080p @ 60fps</option>
                    <option value="1440p30">1440p @ 30fps</option>
                    <option value="1440p60">1440p @ 60fps</option>
                    <option value="4k30">4K @ 30fps</option>
                    <option value="4k60">4K @ 60fps</option>
                  </select>
                </div>
                
                <div class="volume-controls">
                  <span style="font-size: 12px; color: ${platform.color};">🔊</span>
                  <input type="range" class="volume-slider" min="0" max="100" value="${platform.audioSettings.outputVolume}" id="volume-slider">
                  <span id="volume-display" style="font-size: 12px; color: #fff;">${platform.audioSettings.outputVolume}%</span>
                </div>
                
                <div class="platform-display">
                  <div class="logo">
                    ${
                      platform.logoUrl
                        ? `<img src="${platform.logoUrl}" alt="${platform.displayName}" style="width: 120px; height: 120px; border-radius: 20px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                       <span style="display: none;">${platform.logo}</span>`
                        : platform.logo
                    }
                  </div>
                  <div class="name">${platform.displayName}</div>
                  <div class="status">🔴 Live Stream Active</div>
                  <div class="info">
                    <strong>Stream Configuration:</strong><br>
                    Max Resolution: ${platform.limits.maxResolution}<br>
                    Max Bitrate: ${platform.limits.maxBitrate} kbps<br>
                    Features: ${Object.entries(platform.features)
                      .filter(([_, enabled]) => enabled)
                      .map(([feature]) => feature)
                      .join(", ")}<br><br>
                    <strong>Current Stats:</strong><br>
                    Viewers: ${platform.viewers.toLocaleString()}<br>
                    Chat Messages: ${platform.chatMessages}<br>
                    Stream Key: Active (${platform.streamKeys[platform.activeKeyIndex].name})
                  </div>
                </div>
                
                <div class="video-overlay">
                  <div class="stream-info">
                    <div class="stream-title">${platform.displayName} Professional Stream</div>
                    <div class="stream-stats">
                      <span>⏱️ Uptime: ${Math.floor(Math.random() * 120 + 30)} min</span>
                      <span>👥 ${platform.viewers.toLocaleString()} viewers</span>
                      <span>💬 ${platform.chatMessages} messages</span>
                      <span>🎯 ${platform.limits.maxResolution}</span>
                      <span>📡 ${platform.limits.maxBitrate} kbps</span>
                    </div>
                  </div>
                  <div class="controls">
                    <button class="control-btn ${platform.audioSettings.micEnabled ? "active" : ""}" onclick="toggleMic()">
                      🎤 Microphone
                    </button>
                    <button class="control-btn ${platform.videoSettings.webcamEnabled ? "active" : ""}" onclick="toggleCamera()">
                      📹 Camera
                    </button>
                    <button class="control-btn" onclick="toggleScreen()">
                      🖥️ Screen Share
                    </button>
                    <button class="control-btn" onclick="toggleRecord()">
                      ⏺️ Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-section">
              <div class="chat-header">
                <span>💬 Live Chat - ${platform.displayName}</span>
                <span style="font-size: 14px; color: #fff;" id="chat-status">🟢 Connected</span>
              </div>
              <div class="chat-messages" id="chat-messages">
                <div class="chat-message">
                  <strong style="color: ${platform.color};">StreamBot:</strong> Welcome to ${platform.displayName} on Ustream4Free Pro! 🎉
                </div>
                <div class="chat-message">
                  <strong style="color: #22c55e;">Moderator:</strong> Amazing ${platform.limits.maxResolution} quality stream! 🔥
                </div>
                <div class="chat-message">
                  <strong style="color: #3b82f6;">ProViewer:</strong> This ${platform.limits.maxBitrate}kbps bitrate is perfect!
                </div>
                <div class="chat-message">
                  <strong style="color: #8b5cf6;">StreamFan:</strong> Love the professional setup! Keep it up! 💜
                </div>
              </div>
              <div class="chat-input-area">
                <input 
                  type="text" 
                  class="chat-input" 
                  placeholder="Type your message..." 
                  id="chat-input"
                  maxlength="500"
                >
                <button class="send-btn" onclick="sendMessage()">Send</button>
              </div>
            </div>
            
            <!-- 8-direction resize handles -->
            <div class="resize-handle n" data-direction="n"></div>
            <div class="resize-handle ne" data-direction="ne"></div>
            <div class="resize-handle e" data-direction="e"></div>
            <div class="resize-handle se" data-direction="se"></div>
            <div class="resize-handle s" data-direction="s"></div>
            <div class="resize-handle sw" data-direction="sw"></div>
            <div class="resize-handle w" data-direction="w"></div>
            <div class="resize-handle nw" data-direction="nw"></div>
          </div>
          
          <script>
            let isDragging = false;
            let isResizing = false;
            let dragStartX = 0;
            let dragStartY = 0;
            let resizeDirection = '';
            let isMaximized = false;
            let originalBounds = { x: 0, y: 0, width: ${width}, height: ${height} };
            
            // Enhanced dragging for all devices
            const dragHeader = document.getElementById('window-header');
            
            function getEventPos(e) {
              return {
                x: e.touches ? e.touches[0].clientX : e.clientX,
                y: e.touches ? e.touches[0].clientY : e.clientY
              };
            }
            
            function startDrag(e) {
              if (e.target.classList.contains('control-dot') || e.target.classList.contains('resize-handle')) return;
              e.preventDefault();
              isDragging = true;
              const pos = getEventPos(e);
              dragStartX = pos.x - window.screenX;
              dragStartY = pos.y - window.screenY;
              document.body.style.userSelect = 'none';
              document.body.style.cursor = 'grabbing';
            }
            
            dragHeader.addEventListener('mousedown', startDrag);
            dragHeader.addEventListener('touchstart', startDrag, { passive: false });
            
            function handleMove(e) {
              if (isDragging && !isMaximized) {
                e.preventDefault();
                const pos = getEventPos(e);
                const newX = Math.max(0, Math.min(screen.width - window.outerWidth, pos.x - dragStartX));
                const newY = Math.max(0, Math.min(screen.height - window.outerHeight, pos.y - dragStartY));
                window.moveTo(newX, newY);
                updatePositionInfo();
              } else if (isResizing) {
                handleResize(e);
              }
            }
            
            function endDrag() {
              isDragging = false;
              isResizing = false;
              resizeDirection = '';
              document.body.style.userSelect = '';
              document.body.style.cursor = '';
            }
            
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', endDrag);
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', endDrag);
            
            // Enhanced resizing
            const resizeHandles = document.querySelectorAll('.resize-handle');
            resizeHandles.forEach(handle => {
              function startResize(e) {
                e.preventDefault();
                e.stopPropagation();
                isResizing = true;
                resizeDirection = handle.dataset.direction;
                const pos = getEventPos(e);
                dragStartX = pos.x;
                dragStartY = pos.y;
                originalBounds = {
                  x: window.screenX,
                  y: window.screenY,
                  width: window.outerWidth,
                  height: window.outerHeight
                };
              }
              
              handle.addEventListener('mousedown', startResize);
              handle.addEventListener('touchstart', startResize, { passive: false });
            });
            
            function handleResize(e) {
              if (!isResizing || isMaximized) return;
              
              const pos = getEventPos(e);
              const deltaX = pos.x - dragStartX;
              const deltaY = pos.y - dragStartY;
              
              let newX = originalBounds.x;
              let newY = originalBounds.y;
              let newWidth = originalBounds.width;
              let newHeight = originalBounds.height;
              
              switch (resizeDirection) {
                case 'n':
                  newY = originalBounds.y + deltaY;
                  newHeight = originalBounds.height - deltaY;
                  break;
                case 'ne':
                  newY = originalBounds.y + deltaY;
                  newWidth = originalBounds.width + deltaX;
                  newHeight = originalBounds.height - deltaY;
                  break;
                case 'e':
                  newWidth = originalBounds.width + deltaX;
                  break;
                case 'se':
                  newWidth = originalBounds.width + deltaX;
                  newHeight = originalBounds.height + deltaY;
                  break;
                case 's':
                  newHeight = originalBounds.height + deltaY;
                  break;
                case 'sw':
                  newX = originalBounds.x + deltaX;
                  newWidth = originalBounds.width - deltaX;
                  newHeight = originalBounds.height + deltaY;
                  break;
                case 'w':
                  newX = originalBounds.x + deltaX;
                  newWidth = originalBounds.width - deltaX;
                  break;
                case 'nw':
                  newX = originalBounds.x + deltaX;
                  newY = originalBounds.y + deltaY;
                  newWidth = originalBounds.width - deltaX;
                  newHeight = originalBounds.height - deltaY;
                  break;
              }
              
              // Enhanced constraints
              newWidth = Math.max(600, Math.min(screen.width, newWidth));
              newHeight = Math.max(400, Math.min(screen.height, newHeight));
              newX = Math.max(0, Math.min(screen.width - newWidth, newX));
              newY = Math.max(0, Math.min(screen.height - newHeight, newY));
              
              window.moveTo(newX, newY);
              window.resizeTo(newWidth, newHeight);
              updatePositionInfo();
            }
            
            function updatePositionInfo() {
              document.getElementById('pos-x').textContent = window.screenX;
              document.getElementById('pos-y').textContent = window.screenY;
              document.getElementById('size-w').textContent = window.outerWidth;
              document.getElementById('size-h').textContent = window.outerHeight;
            }
            
            function minimizeWindow() {
              window.blur();
            }
            
            function toggleMaximize() {
              if (!isMaximized) {
                originalBounds = {
                  x: window.screenX,
                  y: window.screenY,
                  width: window.outerWidth,
                  height: window.outerHeight
                };
                window.moveTo(0, 0);
                window.resizeTo(screen.width, screen.height);
                isMaximized = true;
              } else {
                window.moveTo(originalBounds.x, originalBounds.y);
                window.resizeTo(originalBounds.width, originalBounds.height);
                isMaximized = false;
              }
              updatePositionInfo();
            }
            
            // Enhanced control functions
            let micOn = ${platform.audioSettings.micEnabled};
            let cameraOn = ${platform.videoSettings.webcamEnabled};
            let screenSharing = false;
            let recording = false;
            
            function toggleMic() {
              micOn = !micOn;
              const btn = document.querySelector('.control-btn');
              btn.className = micOn ? 'control-btn active' : 'control-btn';
              btn.innerHTML = micOn ? '🎤 Microphone ON' : '🔇 Microphone OFF';
            }
            
            function toggleCamera() {
              cameraOn = !cameraOn;
              const btns = document.querySelectorAll('.control-btn');
              btns[1].className = cameraOn ? 'control-btn active' : 'control-btn';
              btns[1].innerHTML = cameraOn ? '📹 Camera ON' : '📹 Camera OFF';
            }
            
            function toggleScreen() {
              screenSharing = !screenSharing;
              const btns = document.querySelectorAll('.control-btn');
              btns[2].className = screenSharing ? 'control-btn active' : 'control-btn';
              btns[2].innerHTML = screenSharing ? '🖥️ Sharing Screen' : '🖥️ Screen Share';
            }
            
            function toggleRecord() {
              recording = !recording;
              const btns = document.querySelectorAll('.control-btn');
              btns[3].className = recording ? 'control-btn active' : 'control-btn';
              btns[3].innerHTML = recording ? '⏹️ Stop Recording' : '⏺️ Start Recording';
            }
            
            function sendMessage() {
              const input = document.getElementById('chat-input');
              const message = input.value.trim();
              if (message) {
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                messageDiv.innerHTML = '<strong style="color: ${platform.color};">You:</strong> ' + message;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                input.value = '';
              }
            }
            
            document.getElementById('chat-input').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') sendMessage();
            });
            
            document.getElementById('volume-slider').addEventListener('input', function(e) {
              document.getElementById('volume-display').textContent = e.target.value + '%';
            });
            
            document.getElementById('quality-select').addEventListener('change', function(e) {
              console.log('Quality changed to:', e.target.value);
            });
            
            // Initialize
            updatePositionInfo();
            
            // Enhanced real-time chat simulation
            const chatMessages = [
              'This stream quality is incredible! 🔥',
              'Love the ${platform.displayName} integration!',
              'Ustream4Free Pro is amazing! 💜',
              'Perfect ${platform.limits.maxResolution} quality!',
              'Keep up the great work!',
              'Best streaming setup ever! 🎉',
              'The ${platform.limits.maxBitrate}kbps bitrate is perfect!',
              'Professional quality stream! 👏',
              'This platform rocks! 🚀',
              'Amazing features! Love it! ❤️'
            ];
            
            const chatUsers = [
              'StreamFan', 'ProViewer', 'TechLover', 'StreamPro', 'ViewerX', 
              'ChatMaster', 'StreamKing', 'TechGuru', 'LiveFan', 'StreamStar'
            ];
            
            setInterval(() => {
              if (Math.random() < 0.4) {
                const chatMessagesContainer = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                const user = chatUsers[Math.floor(Math.random() * chatUsers.length)];
                const message = chatMessages[Math.floor(Math.random() * chatMessages.length)];
                const colors = ['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                messageDiv.innerHTML = '<strong style="color: ' + color + ';">' + user + ':</strong> ' + message;
                chatMessagesContainer.appendChild(messageDiv);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                
                if (chatMessagesContainer.children.length > 50) {
                  chatMessagesContainer.removeChild(chatMessagesContainer.firstChild);
                }
              }
            }, 2000);
            
            // Prevent context menu on mobile
            document.addEventListener('contextmenu', e => e.preventDefault());
            
            // Enhanced touch handling
            document.addEventListener('touchstart', function(e) {
              if (e.touches.length > 1) {
                e.preventDefault(); // Prevent zoom
              }
            }, { passive: false });
          </script>
        </body>
        </html>
      `)

      popup.document.close()
      popup.focus()
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Viewers</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => (p.isActive ? sum + p.viewers : sum), 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Chats</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => (p.isActive ? sum + p.chatMessages : sum), 0)}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Followers</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}
                </p>
              </div>
              <Heart className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Donations</p>
                <p className="text-2xl font-bold">
                  ${platforms.reduce((sum, p) => (p.isActive ? sum + p.donations : sum), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Platform Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Streaming Platforms</h3>
        <Button
          onClick={() => setShowAddPlatform(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      {/* Platform Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                    style={{
                      backgroundColor: `${platform.color}20`,
                      borderColor: `${platform.color}40`,
                    }}
                  >
                    {platform.logoUrl ? (
                      <img
                        src={platform.logoUrl || "/placeholder.svg"}
                        alt={platform.displayName}
                        className="w-8 h-8 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling!.style.display = "block"
                        }}
                      />
                    ) : null}
                    <span className="text-2xl" style={{ display: platform.logoUrl ? "none" : "block" }}>
                      {platform.logo}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.displayName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={platform.isActive ? "destructive" : "secondary"} className="text-xs">
                        {platform.isActive ? "🔴 LIVE" : "⚫ OFFLINE"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: platform.color, color: platform.color }}
                      >
                        {platform.limits.maxResolution}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={platform.isActive} onCheckedChange={() => togglePlatform(platform.id)} />
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                    onClick={() => removePlatform(platform.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Live Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-gray-400">Viewers</div>
                    <div className="text-white font-bold">{platform.viewers.toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-gray-400">Messages</div>
                    <div className="text-white font-bold">{platform.chatMessages}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-400" />
                  <div>
                    <div className="text-gray-400">Followers</div>
                    <div className="text-white font-bold">{platform.followers.toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-yellow-400" />
                  <div>
                    <div className="text-gray-400">Donations</div>
                    <div className="text-white font-bold">${platform.donations.toFixed(2)}</div>
                  </div>
                </div>
              </div>

              {/* Stream Keys Management */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-300">Stream Keys:</div>
                  <Badge variant="outline" className="text-xs">
                    {platform.activeKeyIndex + 1}/5 Active
                  </Badge>
                </div>
                <select
                  className="w-full p-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                  value={platform.activeKeyIndex}
                  onChange={(e) => setActiveKey(platform.id, Number.parseInt(e.target.value))}
                >
                  {platform.streamKeys.map((key, index) => (
                    <option key={index} value={index} className="bg-slate-800">
                      {key.name}: {key.key ? `${key.key.substring(0, 15)}...` : "Not Set"}
                    </option>
                  ))}
                </select>
                <Input
                  placeholder={`Enter ${platform.streamKeys[platform.activeKeyIndex].name}`}
                  value={platform.streamKeys[platform.activeKeyIndex].key}
                  onChange={(e) => updateStreamKey(platform.id, platform.activeKeyIndex, e.target.value)}
                  className="bg-white/20 border-white/30 text-white text-sm"
                />
              </div>

              {/* Audio Controls */}
              <div className="space-y-2">
                <div className="text-xs text-slate-300">Audio Settings:</div>
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-orange-400" />
                  <Slider
                    value={[platform.audioSettings.micVolume]}
                    onValueChange={(value) => updateAudioSettings(platform.id, { micVolume: value[0] })}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-10">{platform.audioSettings.micVolume}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-blue-400" />
                  <Slider
                    value={[platform.audioSettings.outputVolume]}
                    onValueChange={(value) => updateAudioSettings(platform.id, { outputVolume: value[0] })}
                    max={100}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-400 w-10">{platform.audioSettings.outputVolume}%</span>
                </div>
              </div>

              {/* Video Controls */}
              <div className="space-y-2">
                <div className="text-xs text-slate-300">Video Settings:</div>
                <select
                  className="w-full p-2 bg-white/20 border border-white/30 rounded text-white text-xs"
                  value={platform.videoSettings.streamQuality}
                  onChange={(e) => updateVideoSettings(platform.id, { streamQuality: e.target.value })}
                >
                  <option value="720p30">720p @ 30fps</option>
                  <option value="1080p30">1080p @ 30fps</option>
                  <option value="1080p60">1080p @ 60fps</option>
                  <option value="1440p30">1440p @ 30fps</option>
                  <option value="4k30">4K @ 30fps</option>
                </select>
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-purple-400" />
                  <span className="text-xs text-gray-400">Webcam:</span>
                  <Switch
                    checked={platform.videoSettings.webcamEnabled}
                    onCheckedChange={(checked) => updateVideoSettings(platform.id, { webcamEnabled: checked })}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => popOutStream(platform)}
                  className="flex-1 font-medium"
                  style={{
                    backgroundColor: platform.color,
                    color: "white",
                  }}
                  size="sm"
                  disabled={!platform.isActive}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />🚀 Open Stream Window
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3"
                  onClick={() => window.open(platform.oauth.authUrl.split("/oauth")[0], "_blank")}
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </div>

              {/* Platform Features */}
              <div className="flex flex-wrap gap-1">
                {platform.features.liveStreaming && (
                  <Badge variant="secondary" className="text-xs">
                    Live
                  </Badge>
                )}
                {platform.features.chat && (
                  <Badge variant="secondary" className="text-xs">
                    Chat
                  </Badge>
                )}
                {platform.features.analytics && (
                  <Badge variant="secondary" className="text-xs">
                    Analytics
                  </Badge>
                )}
                {platform.features.multistream && (
                  <Badge variant="secondary" className="text-xs">
                    Multi
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Add this button at the bottom of the platform grid: */}
      <div className="flex justify-center mt-6">
        <Button
          onClick={() => setShowAddPlatform(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          size="lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Platform
        </Button>
      </div>

      {/* Add Platform Modal */}
      {showAddPlatform && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="bg-gray-900 border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-white">Add Streaming Platform</CardTitle>
                <Button variant="outline" onClick={() => setShowAddPlatform(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {["major", "gaming", "social", "professional", "alternative", "international", "emerging"].map(
                  (category) => (
                    <Button
                      key={category}
                      size="sm"
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ),
                )}
              </div>

              {/* Platform Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ALL_STREAMING_PLATFORMS.filter((p) => p.category === selectedCategory)
                  .filter((p) => !platforms.find((existing) => existing.id === p.id))
                  .map((platformConfig) => (
                    <Card
                      key={platformConfig.id}
                      className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:scale-105"
                      onClick={() => addPlatform(platformConfig)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="text-2xl w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${platformConfig.color}20`,
                                border: `1px solid ${platformConfig.color}40`,
                              }}
                            >
                              {platformConfig.logoUrl ? (
                                <img
                                  src={platformConfig.logoUrl || "/placeholder.svg"}
                                  alt={platformConfig.displayName}
                                  className="w-6 h-6 rounded"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none"
                                    const nextSibling = e.currentTarget.nextElementSibling as HTMLElement
                                    if (nextSibling) nextSibling.style.display = "block"
                                  }}
                                />
                              ) : null}
                              <span style={{ display: platformConfig.logoUrl ? "none" : "block" }}>
                                {platformConfig.logo}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white text-sm">{platformConfig.displayName}</h3>
                              <Badge
                                variant="outline"
                                className="text-xs mt-1"
                                style={{ borderColor: platformConfig.color, color: platformConfig.color }}
                              >
                                {platformConfig.category}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 mb-3">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>Max: {platformConfig.limits.maxResolution}</span>
                            <span>•</span>
                            <span>{platformConfig.limits.maxBitrate} kbps</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {platformConfig.features.liveStreaming && (
                              <Badge variant="secondary" className="text-xs">
                                Live
                              </Badge>
                            )}
                            {platformConfig.features.chat && (
                              <Badge variant="secondary" className="text-xs">
                                Chat
                              </Badge>
                            )}
                            {platformConfig.features.analytics && (
                              <Badge variant="secondary" className="text-xs">
                                Analytics
                              </Badge>
                            )}
                            {platformConfig.features.multistream && (
                              <Badge variant="secondary" className="text-xs">
                                Multi
                              </Badge>
                            )}
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full"
                          style={{
                            backgroundColor: platformConfig.color,
                            color: "white",
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Platform
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
