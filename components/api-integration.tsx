"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Globe, CheckCircle, XCircle, RefreshCw, Settings, Eye, EyeOff } from "lucide-react"

interface APICredentials {
  platformId: string
  clientId: string
  clientSecret: string
  accessToken: string
  refreshToken: string
  isConnected: boolean
  lastSync: Date | null
}

interface APIIntegrationProps {
  platforms: Array<{
    id: string
    name: string
    displayName: string
    color: string
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
  }>
}

export function APIIntegration({ platforms }: APIIntegrationProps) {
  const [credentials, setCredentials] = useState<APICredentials[]>([])
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [isConnecting, setIsConnecting] = useState<Record<string, boolean>>({})

  // Initialize credentials for all platforms
  useEffect(() => {
    const initialCredentials = platforms.map((platform) => ({
      platformId: platform.id,
      clientId: "",
      clientSecret: "",
      accessToken: "",
      refreshToken: "",
      isConnected: false,
      lastSync: null,
    }))
    setCredentials(initialCredentials)
  }, [platforms])

  const updateCredential = (platformId: string, field: keyof APICredentials, value: string | boolean | Date) => {
    setCredentials((prev) => prev.map((cred) => (cred.platformId === platformId ? { ...cred, [field]: value } : cred)))
  }

  const toggleSecretVisibility = (platformId: string) => {
    setShowSecrets((prev) => ({
      ...prev,
      [platformId]: !prev[platformId],
    }))
  }

  const connectPlatform = async (platformId: string) => {
    setIsConnecting((prev) => ({ ...prev, [platformId]: true }))

    try {
      const platform = platforms.find((p) => p.id === platformId)
      const cred = credentials.find((c) => c.platformId === platformId)

      if (!platform || !cred || !cred.clientId || !cred.clientSecret) {
        throw new Error("Missing credentials")
      }

      // Simulate API connection
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update connection status
      updateCredential(platformId, "isConnected", true)
      updateCredential(platformId, "lastSync", new Date())
      updateCredential(platformId, "accessToken", `${platformId}_access_token_${Date.now()}`)
    } catch (error) {
      console.error(`Failed to connect to ${platformId}:`, error)
      updateCredential(platformId, "isConnected", false)
    } finally {
      setIsConnecting((prev) => ({ ...prev, [platformId]: false }))
    }
  }

  const disconnectPlatform = (platformId: string) => {
    updateCredential(platformId, "isConnected", false)
    updateCredential(platformId, "accessToken", "")
    updateCredential(platformId, "refreshToken", "")
    updateCredential(platformId, "lastSync", null)
  }

  const refreshToken = async (platformId: string) => {
    setIsConnecting((prev) => ({ ...prev, [platformId]: true }))

    try {
      // Simulate token refresh
      await new Promise((resolve) => setTimeout(resolve, 1000))
      updateCredential(platformId, "lastSync", new Date())
    } catch (error) {
      console.error(`Failed to refresh token for ${platformId}:`, error)
    } finally {
      setIsConnecting((prev) => ({ ...prev, [platformId]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API Integration</h2>
        <Badge variant="outline" className="text-green-400 border-green-400">
          {credentials.filter((c) => c.isConnected).length} / {credentials.length} Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const cred = credentials.find((c) => c.platformId === platform.id)
          if (!cred) return null

          return (
            <Card key={platform.id} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                      style={{
                        backgroundColor: `${platform.color}20`,
                        border: `1px solid ${platform.color}40`,
                      }}
                    >
                      {platform.name === "twitch" && "🟣"}
                      {platform.name === "youtube" && "🔴"}
                      {platform.name === "x" && "🐦"}
                      {platform.name === "facebook" && "🔵"}
                      {platform.name === "tiktok" && "🎵"}
                      {platform.name === "discord" && "🟦"}
                      {platform.name === "kick" && "🟢"}
                    </div>
                    <span className="text-white">{platform.displayName}</span>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {cred.isConnected ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <Badge
                      variant={cred.isConnected ? "default" : "secondary"}
                      style={{
                        backgroundColor: cred.isConnected ? platform.color : undefined,
                        color: cred.isConnected ? "white" : undefined,
                      }}
                    >
                      {cred.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Client ID */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Client ID</label>
                  <Input
                    type="text"
                    placeholder={`Enter ${platform.displayName} Client ID`}
                    value={cred.clientId}
                    onChange={(e) => updateCredential(platform.id, "clientId", e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>

                {/* Client Secret */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-300">Client Secret</label>
                  <div className="relative">
                    <Input
                      type={showSecrets[platform.id] ? "text" : "password"}
                      placeholder={`Enter ${platform.displayName} Client Secret`}
                      value={cred.clientSecret}
                      onChange={(e) => updateCredential(platform.id, "clientSecret", e.target.value)}
                      className="bg-white/20 border-white/30 text-white pr-10"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => toggleSecretVisibility(platform.id)}
                    >
                      {showSecrets[platform.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {/* Access Token (Read-only) */}
                {cred.accessToken && (
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Access Token</label>
                    <Input
                      type="text"
                      value={`${cred.accessToken.substring(0, 20)}...`}
                      readOnly
                      className="bg-gray-800/50 border-gray-600 text-gray-400"
                    />
                  </div>
                )}

                {/* Connection Status */}
                {cred.lastSync && (
                  <div className="text-xs text-gray-400">Last synced: {cred.lastSync.toLocaleString()}</div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!cred.isConnected ? (
                    <Button
                      onClick={() => connectPlatform(platform.id)}
                      disabled={!cred.clientId || !cred.clientSecret || isConnecting[platform.id]}
                      className="flex-1"
                      style={{ backgroundColor: platform.color }}
                    >
                      {isConnecting[platform.id] ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => refreshToken(platform.id)}
                        disabled={isConnecting[platform.id]}
                        variant="outline"
                        className="flex-1"
                      >
                        {isConnecting[platform.id] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                      </Button>
                      <Button onClick={() => disconnectPlatform(platform.id)} variant="destructive" className="flex-1">
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>

                {/* API Endpoints Info */}
                <div className="bg-gray-800/30 rounded-lg p-3 space-y-1">
                  <div className="text-xs text-gray-400">API Endpoints:</div>
                  <div className="text-xs text-gray-300">Stream: {platform.api.streamEndpoint}</div>
                  {platform.api.chatEndpoint && (
                    <div className="text-xs text-gray-300">Chat: {platform.api.chatEndpoint}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Global API Settings */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Global API Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Auto-refresh tokens</div>
              <div className="text-sm text-gray-400">Automatically refresh expired tokens</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Sync stream keys</div>
              <div className="text-sm text-gray-400">Keep stream keys synchronized across platforms</div>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Real-time analytics</div>
              <div className="text-sm text-gray-400">Enable live viewer and engagement tracking</div>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
