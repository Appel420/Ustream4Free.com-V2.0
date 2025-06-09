"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Key, CheckCircle, ExternalLink, Copy, Eye, EyeOff } from "lucide-react"
import { type PlatformConfig, getPlatformsByCategory } from "@/lib/platform-registry"
import { SecureOAuthManager } from "@/lib/secure-oauth"

interface SecurePlatformSelectorProps {
  onPlatformAdd: (platform: PlatformConfig) => void
  onClose: () => void
}

export function SecurePlatformSelector({ onPlatformAdd, onClose }: SecurePlatformSelectorProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformConfig | null>(null)
  const [credentials, setCredentials] = useState({ clientId: "", clientSecret: "" })
  const [showSecret, setShowSecret] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStatus, setAuthStatus] = useState<"idle" | "success" | "error">("idle")
  const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([])

  const oauthManager = SecureOAuthManager.getInstance()

  useEffect(() => {
    setAvailablePlatforms(oauthManager.getAvailablePlatforms())
  }, [])

  const handleCredentialsSubmit = () => {
    if (!selectedPlatform || !credentials.clientId || !credentials.clientSecret) return

    // Store credentials securely (only in memory)
    oauthManager.setCredentials(selectedPlatform.id, credentials.clientId, credentials.clientSecret)
    setAvailablePlatforms(oauthManager.getAvailablePlatforms())

    // Clear the form
    setCredentials({ clientId: "", clientSecret: "" })
    setAuthStatus("success")

    setTimeout(() => {
      setAuthStatus("idle")
      setSelectedPlatform(null)
    }, 2000)
  }

  const handleOAuthFlow = async (platform: PlatformConfig) => {
    if (!oauthManager.hasCredentials(platform.id)) {
      setSelectedPlatform(platform)
      return
    }

    setIsAuthenticating(true)
    try {
      // Start the OAuth flow using the enhanced manager
      const authUrl = await oauthManager.startOAuthFlow(platform.id)

      // Open OAuth flow in popup
      const popup = window.open(authUrl, "oauth", "width=600,height=700,scrollbars=yes,resizable=yes")

      // Listen for OAuth completion
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return

        if (event.data.type === "oauth_success") {
          popup?.close()

          try {
            // Handle the callback with the authorization code
            const result = await oauthManager.handleCallback(event.data.code, event.data.state, platform.id)

            if (result.success) {
              setAuthStatus("success")
              onPlatformAdd(platform)

              // Show success message
              setTimeout(() => {
                setAuthStatus("idle")
                setSelectedPlatform(null)
              }, 2000)
            } else {
              setAuthStatus("error")
              console.error("OAuth callback failed:", result.error)
            }
          } catch (error) {
            console.error("OAuth callback error:", error)
            setAuthStatus("error")
          }

          setIsAuthenticating(false)
          window.removeEventListener("message", handleMessage)
        } else if (event.data.type === "oauth_error") {
          popup?.close()
          setAuthStatus("error")
          setIsAuthenticating(false)
          console.error("OAuth error:", event.data.error, event.data.description)
          window.removeEventListener("message", handleMessage)
        }
      }

      window.addEventListener("message", handleMessage)

      // Handle popup being closed manually
      const checkClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkClosed)
          setIsAuthenticating(false)
          window.removeEventListener("message", handleMessage)
        }
      }, 1000)
    } catch (error) {
      console.error("OAuth flow error:", error)
      setAuthStatus("error")
      setIsAuthenticating(false)
    }
  }

  const getAuthenticationStatus = (platformId: string) => {
    const config = oauthManager.getOAuthConfig(platformId)
    if (!config) return { status: "no_credentials", message: "Setup required" }

    if (!config.isAuthenticated) return { status: "not_authenticated", message: "Authentication required" }

    if (config.tokenExpiresAt && Date.now() >= config.tokenExpiresAt - 300000) {
      return { status: "expires_soon", message: "Token expires soon" }
    }

    return { status: "authenticated", message: "Ready to stream" }
  }

  const copyEnvTemplate = () => {
    navigator.clipboard.writeText(`
# Add your OAuth credentials to .env.local
# NEVER commit this file to git!

# Twitch
NEXT_PUBLIC_TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret

# YouTube  
NEXT_PUBLIC_YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret

# Add more platforms as needed...
    `)
  }

  const categories = ["major", "gaming", "social", "professional", "alternative"]

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                Secure Platform Integration
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">Your credentials are kept completely private and secure</p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {selectedPlatform ? (
            <div className="space-y-6">
              <Alert className="border-blue-600 bg-blue-900/20">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  <strong>Security Notice:</strong> Your OAuth credentials are stored only in memory and never sent to
                  any server. They're completely private to your browser session.
                </AlertDescription>
              </Alert>

              <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  {selectedPlatform.logo} Configure {selectedPlatform.displayName}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client ID</label>
                    <Input
                      type="text"
                      value={credentials.clientId}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, clientId: e.target.value }))}
                      placeholder="Enter your client ID"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Client Secret</label>
                    <div className="relative">
                      <Input
                        type={showSecret ? "text" : "password"}
                        value={credentials.clientSecret}
                        onChange={(e) => setCredentials((prev) => ({ ...prev, clientSecret: e.target.value }))}
                        placeholder="Enter your client secret"
                        className="bg-gray-800 border-gray-600 text-white pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                        onClick={() => setShowSecret(!showSecret)}
                      >
                        {showSecret ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="bg-gray-900/50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">How to get your credentials:</h4>
                    <ol className="text-xs text-gray-400 space-y-1">
                      <li>1. Visit the {selectedPlatform.displayName} Developer Console</li>
                      <li>2. Create a new application</li>
                      <li>3. Copy your Client ID and Client Secret</li>
                      <li>
                        4. Set redirect URI to:{" "}
                        <code className="bg-gray-800 px-1 rounded">{window.location.origin}/oauth/callback</code>
                      </li>
                    </ol>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => window.open(selectedPlatform.oauth.authUrl.split("/oauth")[0], "_blank")}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open Developer Console
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCredentialsSubmit}
                      disabled={!credentials.clientId || !credentials.clientSecret}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Save Credentials Securely
                    </Button>
                    <Button variant="outline" onClick={() => setSelectedPlatform(null)}>
                      Cancel
                    </Button>
                  </div>

                  {authStatus === "success" && (
                    <Alert className="border-green-600 bg-green-900/20">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription className="text-green-200">
                        Credentials saved securely! You can now authenticate with {selectedPlatform.displayName}.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Remove all custom platform name input functionality
            // Only allow selection from pre-configured OAuth platforms
            <Tabs defaultValue="major" className="w-full">
              <TabsList className="grid w-full grid-cols-5 bg-gray-800">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getPlatformsByCategory(category).map((platform) => (
                      <Card
                        key={platform.id}
                        className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{platform.logo}</span>
                              <div>
                                <h3 className="font-semibold text-white">{platform.displayName}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {platform.category}
                                </Badge>
                              </div>
                            </div>
                            {oauthManager.hasCredentials(platform.id) && (
                              <CheckCircle className="h-5 w-5 text-green-400" />
                            )}
                          </div>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <span>Max: {platform.limits.maxResolution}</span>
                              <span>•</span>
                              <span>{platform.limits.maxBitrate} kbps</span>
                            </div>
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
                            </div>
                          </div>

                          <Button
                            onClick={() => handleOAuthFlow(platform)}
                            disabled={isAuthenticating}
                            className="w-full"
                            variant={oauthManager.hasCredentials(platform.id) ? "default" : "outline"}
                          >
                            {oauthManager.hasCredentials(platform.id) ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Connect {platform.displayName}
                              </>
                            ) : (
                              <>
                                <Key className="h-4 w-4 mr-2" />
                                Setup {platform.displayName}
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}

          <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Security Features</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Credentials stored only in browser memory (never on servers)</li>
              <li>• OAuth flows use secure PKCE when available</li>
              <li>• All API calls use HTTPS encryption</li>
              <li>• Credentials cleared when you close the browser</li>
            </ul>
            <Button variant="outline" size="sm" className="mt-2" onClick={copyEnvTemplate}>
              <Copy className="h-3 w-3 mr-1" />
              Copy .env Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
