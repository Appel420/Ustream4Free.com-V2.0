"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Server,
  Play,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Users,
  Wifi,
  Activity,
  Settings,
  Shield,
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

interface MultistreamServerProps {
  platforms: Platform[]
  onUpdatePlatform: (platformId: string, updates: Partial<Platform>) => void
  isStreaming: boolean
  onToggleStreaming: () => void
}

interface ServerStats {
  totalBandwidth: number
  totalViewers: number
  uptime: string
  packetsLost: number
  latency: number
  cpuUsage: number
  memoryUsage: number
}

export function MultistreamServer({
  platforms,
  onUpdatePlatform,
  isStreaming,
  onToggleStreaming,
}: MultistreamServerProps) {
  const [serverStats, setServerStats] = useState<ServerStats>({
    totalBandwidth: 0,
    totalViewers: 0,
    uptime: "00:00:00",
    packetsLost: 0,
    latency: 45,
    cpuUsage: 35,
    memoryUsage: 42,
  })

  const [autoReconnect, setAutoReconnect] = useState(true)
  const [adaptiveBitrate, setAdaptiveBitrate] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  // Calculate server stats
  useEffect(() => {
    const activePlatforms = platforms.filter((p) => p.isActive)
    const connectedPlatforms = platforms.filter((p) => p.connectionStatus === "connected")

    setServerStats((prev) => ({
      ...prev,
      totalBandwidth: activePlatforms.reduce((sum, p) => sum + p.bitrate, 0),
      totalViewers: connectedPlatforms.reduce((sum, p) => sum + p.viewers, 0),
    }))
  }, [platforms])

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (isStreaming) {
        setServerStats((prev) => ({
          ...prev,
          latency: Math.max(20, Math.min(100, prev.latency + (Math.random() - 0.5) * 10)),
          cpuUsage: Math.max(10, Math.min(90, prev.cpuUsage + (Math.random() - 0.5) * 5)),
          memoryUsage: Math.max(20, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 3)),
          packetsLost: prev.packetsLost + Math.floor(Math.random() * 2),
        }))
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isStreaming])

  const connectPlatform = async (platformId: string) => {
    setIsConnecting(true)
    onUpdatePlatform(platformId, { connectionStatus: "connecting" })

    try {
      // Simulate connection process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const platform = platforms.find((p) => p.id === platformId)
      const activeKey = platform?.streamKeys[platform.activeKeyIndex]

      if (activeKey?.isValid && activeKey.key) {
        onUpdatePlatform(platformId, {
          connectionStatus: "connected",
          uptime: 0,
        })
      } else {
        throw new Error("Invalid stream key")
      }
    } catch (error) {
      onUpdatePlatform(platformId, { connectionStatus: "error" })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectPlatform = (platformId: string) => {
    onUpdatePlatform(platformId, {
      connectionStatus: "disconnected",
      uptime: 0,
    })
  }

  const canGoLive = () => {
    const activePlatforms = platforms.filter((p) => p.isActive)
    return (
      activePlatforms.length > 0 &&
      activePlatforms.every((p) => {
        const activeKey = p.streamKeys[p.activeKeyIndex]
        return activeKey?.isValid && activeKey.key && p.connectionStatus === "connected"
      })
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "connecting":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />
    }
  }

  const getPlatformLogo = (platform: Platform) => {
    if (platform.logoUrl) {
      return (
        <img
          src={platform.logoUrl || "/placeholder.svg"}
          alt={platform.displayName}
          className="w-6 h-6 rounded object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none"
            const fallback = document.createElement("span")
            fallback.className = "text-lg"
            fallback.textContent = platform.logo
            e.currentTarget.parentNode?.appendChild(fallback)
          }}
        />
      )
    }
    return <span className="text-lg">{platform.logo}</span>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Server className="h-6 w-6 text-red-400" />
          Multistream Server
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant={isStreaming ? "destructive" : "secondary"}>{isStreaming ? "🔴 LIVE" : "⚫ OFFLINE"}</Badge>
          <Button
            onClick={onToggleStreaming}
            disabled={!canGoLive() && !isStreaming}
            className={isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
          >
            {isStreaming ? <Square className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {isStreaming ? "Stop Stream" : "Go Live"}
          </Button>
        </div>
      </div>

      {/* Server Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">Bandwidth</span>
              </div>
              <span className="text-blue-400 font-bold">{(serverStats.totalBandwidth / 1000).toFixed(1)}M</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Viewers</span>
              </div>
              <span className="text-green-400 font-bold">{serverStats.totalViewers.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-medium">Latency</span>
              </div>
              <span className="text-yellow-400 font-bold">{serverStats.latency}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">CPU</span>
              </div>
              <span className="text-purple-400 font-bold">{serverStats.cpuUsage}%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Status */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Platform Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {platforms.map((platform) => {
            const activeKey = platform.streamKeys[platform.activeKeyIndex]
            const isReady = platform.isActive && activeKey?.isValid && activeKey.key

            return (
              <div key={platform.id} className="p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20`, border: `1px solid ${platform.color}40` }}
                    >
                      {getPlatformLogo(platform)}
                    </div>
                    <div>
                      <div className="text-white font-medium">{platform.displayName}</div>
                      <div className="flex items-center gap-2 text-sm">
                        {getStatusIcon(platform.connectionStatus)}
                        <span className="text-gray-400 capitalize">{platform.connectionStatus}</span>
                        {platform.isActive && (
                          <Badge variant="outline" style={{ borderColor: platform.color, color: platform.color }}>
                            {platform.quality}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right text-sm">
                      <div className="text-white">{platform.viewers} viewers</div>
                      <div className="text-gray-400">{platform.bitrate} kbps</div>
                    </div>

                    {platform.isActive && (
                      <>
                        {platform.connectionStatus === "disconnected" && isReady && (
                          <Button
                            size="sm"
                            onClick={() => connectPlatform(platform.id)}
                            disabled={isConnecting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Connect
                          </Button>
                        )}

                        {platform.connectionStatus === "connected" && (
                          <Button size="sm" onClick={() => disconnectPlatform(platform.id)} variant="destructive">
                            Disconnect
                          </Button>
                        )}

                        {platform.connectionStatus === "connecting" && (
                          <Button size="sm" disabled>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Platform Details */}
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Stream Key:</span>
                    <div className="text-white">
                      {activeKey?.key ? (
                        <span className="flex items-center gap-1">
                          {activeKey.key.substring(0, 8)}...
                          {activeKey.isValid ? (
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          ) : (
                            <XCircle className="h-3 w-3 text-red-400" />
                          )}
                        </span>
                      ) : (
                        <span className="text-red-400">Not Set</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Uptime:</span>
                    <div className="text-white">
                      {platform.connectionStatus === "connected"
                        ? new Date(platform.uptime * 1000).toISOString().substr(11, 8)
                        : "00:00:00"}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Status:</span>
                    <div className={`font-medium ${isReady ? "text-green-400" : "text-red-400"}`}>
                      {isReady ? "Ready" : "Not Ready"}
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-400">Active:</span>
                    <div className={`font-medium ${platform.isActive ? "text-green-400" : "text-gray-400"}`}>
                      {platform.isActive ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Progress bar for connecting */}
                {platform.connectionStatus === "connecting" && (
                  <div className="mt-3">
                    <Progress value={66} className="h-2" />
                    <div className="text-xs text-gray-400 mt-1">Establishing connection...</div>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Server Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Server Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto Reconnect</div>
              <div className="text-sm text-gray-400">Automatically reconnect dropped platforms</div>
            </div>
            <Switch checked={autoReconnect} onCheckedChange={setAutoReconnect} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Adaptive Bitrate</div>
              <div className="text-sm text-gray-400">Adjust bitrate based on network conditions</div>
            </div>
            <Switch checked={adaptiveBitrate} onCheckedChange={setAdaptiveBitrate} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
            <div>
              <div className="text-sm text-gray-400">Server CPU Usage</div>
              <Progress value={serverStats.cpuUsage} className="mt-1" />
              <div className="text-xs text-gray-500 mt-1">{serverStats.cpuUsage}%</div>
            </div>

            <div>
              <div className="text-sm text-gray-400">Memory Usage</div>
              <Progress value={serverStats.memoryUsage} className="mt-1" />
              <div className="text-xs text-gray-500 mt-1">{serverStats.memoryUsage}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation Warning */}
      {!canGoLive() && (
        <Card className="bg-red-900/20 border-red-600/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Cannot Go Live</span>
            </div>
            <div className="text-sm text-red-300 mt-1">
              All active platforms must have valid stream keys and be connected before going live.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
