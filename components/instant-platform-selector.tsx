"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, CheckCircle, ExternalLink, Globe } from "lucide-react"
import {
  ALL_STREAMING_PLATFORMS,
  PLATFORM_CATEGORIES,
  getPlatformsByCategory,
  type StreamingPlatform,
} from "@/lib/comprehensive-platforms"

interface InstantPlatformSelectorProps {
  onPlatformAdd: (platform: StreamingPlatform) => void
  onClose: () => void
  addedPlatforms: string[]
}

export function InstantPlatformSelector({ onPlatformAdd, onClose, addedPlatforms }: InstantPlatformSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("major")

  const filteredPlatforms = getPlatformsByCategory(selectedCategory).filter(
    (platform) =>
      platform.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePlatformClick = (platform: StreamingPlatform) => {
    if (addedPlatforms.includes(platform.id)) return

    // Instantly add platform with OAuth ready
    onPlatformAdd(platform)
  }

  const openDeveloperConsole = (platform: StreamingPlatform) => {
    const consoleUrls: Record<string, string> = {
      twitch: "https://dev.twitch.tv/console",
      youtube: "https://console.developers.google.com/",
      facebook: "https://developers.facebook.com/apps/",
      instagram: "https://developers.facebook.com/apps/",
      tiktok: "https://developers.tiktok.com/",
      x: "https://developer.twitter.com/en/portal/dashboard",
      kick: "https://kick.com/developer",
      discord: "https://discord.com/developers/applications",
      linkedin: "https://www.linkedin.com/developers/apps",
      vimeo: "https://developer.vimeo.com/apps",
      rumble: "https://rumble.com/developer",
      odysee: "https://odysee.com/$/developer",
    }

    const url = consoleUrls[platform.id] || platform.oauth.authUrl.split("/oauth")[0]
    window.open(url, "_blank")
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Globe className="h-6 w-6 text-purple-400" />
                Add Streaming Platform
              </CardTitle>
              <p className="text-gray-400 text-sm mt-1">
                Click any platform to instantly add with OAuth ready • {ALL_STREAMING_PLATFORMS.length} platforms
                available
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {filteredPlatforms.length} platforms
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-7 bg-gray-800 mb-6">
              {PLATFORM_CATEGORIES.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs flex flex-col gap-1">
                  <span>{category.name}</span>
                  <Badge variant="secondary" className="text-xs px-1">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {PLATFORM_CATEGORIES.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {getPlatformsByCategory(category.id)
                    .filter(
                      (platform) =>
                        platform.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        platform.name.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((platform) => {
                      const isAdded = addedPlatforms.includes(platform.id)

                      return (
                        <Card
                          key={platform.id}
                          className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer ${
                            isAdded ? "border-green-500 bg-green-900/20" : "hover:scale-105"
                          }`}
                          onClick={() => handlePlatformClick(platform)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="text-2xl w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{
                                    backgroundColor: `${platform.color}20`,
                                    border: `1px solid ${platform.color}40`,
                                  }}
                                >
                                  {platform.logoUrl ? (
                                    <img
                                      src={platform.logoUrl || "/placeholder.svg"}
                                      alt={platform.displayName}
                                      className="w-6 h-6 rounded"
                                      onError={(e) => {
                                        e.currentTarget.style.display = "none"
                                        e.currentTarget.nextElementSibling!.style.display = "block"
                                      }}
                                    />
                                  ) : null}
                                  <span style={{ display: platform.logoUrl ? "none" : "block" }}>{platform.logo}</span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white text-sm">{platform.displayName}</h3>
                                  <Badge
                                    variant="outline"
                                    className="text-xs mt-1"
                                    style={{ borderColor: platform.color, color: platform.color }}
                                  >
                                    {platform.category}
                                  </Badge>
                                </div>
                              </div>
                              {isAdded && <CheckCircle className="h-5 w-5 text-green-400" />}
                            </div>

                            <div className="space-y-2 mb-3">
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
                                {platform.features.multistream && (
                                  <Badge variant="secondary" className="text-xs">
                                    Multi
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1"
                                disabled={isAdded}
                                style={{
                                  backgroundColor: isAdded ? "#22c55e" : platform.color,
                                  color: "white",
                                }}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Added
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3 w-3 mr-1" />
                                    Add
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="px-2"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openDeveloperConsole(platform)
                                }}
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                              OAuth: {platform.oauth.scopes.length} scopes • Status: {platform.status}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-white">Instant Setup Features</span>
            </div>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Click any platform to instantly add with pre-configured OAuth</li>
              <li>• All {ALL_STREAMING_PLATFORMS.length} platforms include real API endpoints and stream URLs</li>
              <li>• Developer console links for easy app creation</li>
              <li>• Real-time platform status and feature detection</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
