"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertTriangle, Clock, RefreshCw, LogOut } from "lucide-react"
import { SecureOAuthManager } from "@/lib/secure-oauth"
import type { PlatformConfig } from "@/lib/platform-registry"

interface OAuthStatusProps {
  platforms: PlatformConfig[]
  onReauthenticate: (platform: PlatformConfig) => void
}

export function OAuthStatus({ platforms, onReauthenticate }: OAuthStatusProps) {
  const [statuses, setStatuses] = useState<Map<string, any>>(new Map())
  const [refreshing, setRefreshing] = useState<Set<string>>(new Set())

  const oauthManager = SecureOAuthManager.getInstance()

  useEffect(() => {
    const updateStatuses = () => {
      const newStatuses = new Map()
      platforms.forEach((platform) => {
        const config = oauthManager.getOAuthConfig(platform.id)
        newStatuses.set(platform.id, config)
      })
      setStatuses(newStatuses)
    }

    updateStatuses()
    const interval = setInterval(updateStatuses, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [platforms])

  const handleRefreshToken = async (platform: PlatformConfig) => {
    setRefreshing((prev) => new Set(prev).add(platform.id))

    try {
      const success = await oauthManager.refreshToken(platform.id)
      if (!success) {
        // If refresh fails, trigger reauthentication
        onReauthenticate(platform)
      }
    } catch (error) {
      console.error("Token refresh failed:", error)
      onReauthenticate(platform)
    } finally {
      setRefreshing((prev) => {
        const newSet = new Set(prev)
        newSet.delete(platform.id)
        return newSet
      })
    }
  }

  const handleRevokeAuth = (platform: PlatformConfig) => {
    oauthManager.revokeAuthentication(platform.id)
    setStatuses((prev) => {
      const newMap = new Map(prev)
      newMap.delete(platform.id)
      return newMap
    })
  }

  const getStatusInfo = (platform: PlatformConfig) => {
    const status = statuses.get(platform.id)
    if (!status) return { type: "no_credentials", message: "Setup required", color: "gray" }

    if (!status.isAuthenticated) return { type: "not_authenticated", message: "Authentication required", color: "red" }

    if (status.tokenExpiresAt) {
      const timeUntilExpiry = status.tokenExpiresAt - Date.now()
      if (timeUntilExpiry < 300000) {
        // 5 minutes
        return { type: "expires_soon", message: "Token expires soon", color: "yellow" }
      }
      if (timeUntilExpiry < 3600000) {
        // 1 hour
        return { type: "expires_hour", message: "Token expires in 1 hour", color: "orange" }
      }
    }

    return { type: "authenticated", message: "Ready to stream", color: "green" }
  }

  const formatTimeUntilExpiry = (expiresAt: number) => {
    const timeLeft = expiresAt - Date.now()
    if (timeLeft < 0) return "Expired"

    const hours = Math.floor(timeLeft / 3600000)
    const minutes = Math.floor((timeLeft % 3600000) / 60000)

    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-400" />
          OAuth Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {platforms.length === 0 && (
          <Alert className="border-blue-600 bg-blue-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              No platforms configured. Add platforms to see their authentication status.
            </AlertDescription>
          </Alert>
        )}

        {platforms.map((platform) => {
          const statusInfo = getStatusInfo(platform)
          const status = statuses.get(platform.id)
          const isRefreshing = refreshing.has(platform.id)

          return (
            <div key={platform.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.logo}</span>
                  <div>
                    <h3 className="font-semibold text-white">{platform.displayName}</h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        statusInfo.color === "green"
                          ? "border-green-600 text-green-400"
                          : statusInfo.color === "yellow"
                            ? "border-yellow-600 text-yellow-400"
                            : statusInfo.color === "orange"
                              ? "border-orange-600 text-orange-400"
                              : statusInfo.color === "red"
                                ? "border-red-600 text-red-400"
                                : "border-gray-600 text-gray-400"
                      }`}
                    >
                      {statusInfo.type === "authenticated" && <CheckCircle className="h-3 w-3 mr-1" />}
                      {statusInfo.type === "expires_soon" && <Clock className="h-3 w-3 mr-1" />}
                      {statusInfo.type === "expires_hour" && <AlertTriangle className="h-3 w-3 mr-1" />}
                      {statusInfo.message}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {status?.isAuthenticated && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRefreshToken(platform)}
                        disabled={isRefreshing}
                        className="h-8"
                      >
                        <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRevokeAuth(platform)}
                        className="h-8 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <LogOut className="h-3 w-3 mr-1" />
                        Revoke
                      </Button>
                    </>
                  )}

                  {!status?.isAuthenticated && (
                    <Button
                      size="sm"
                      onClick={() => onReauthenticate(platform)}
                      className="h-8 bg-blue-600 hover:bg-blue-700"
                    >
                      Authenticate
                    </Button>
                  )}
                </div>
              </div>

              {status?.isAuthenticated && status.tokenExpiresAt && (
                <div className="text-xs text-gray-400 space-y-1">
                  <div>Scope: {status.scope || "Default"}</div>
                  <div>Expires: {formatTimeUntilExpiry(status.tokenExpiresAt)}</div>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
