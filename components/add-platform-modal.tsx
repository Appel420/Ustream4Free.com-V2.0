"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus, Search } from "lucide-react"

interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl: string
  color: string
  category: string
  streamEndpoint: string
  maxBitrate: number
  maxResolution: string
}

const AVAILABLE_PLATFORMS: Platform[] = [
  {
    id: "discord",
    name: "discord",
    displayName: "Discord",
    logo: "🟦",
    logoUrl: "/logos/discord-logo.png",
    color: "#5865F2",
    category: "Gaming",
    streamEndpoint: "https://discord.com/api/v10/channels/{channel_id}/call",
    maxBitrate: 8000,
    maxResolution: "1080p60",
  },
  {
    id: "instagram",
    name: "instagram",
    displayName: "Instagram Live",
    logo: "📷",
    logoUrl: "/logos/instagram-logo.png",
    color: "#E4405F",
    category: "Social",
    streamEndpoint: "rtmp://live-upload.instagram.com/rtmp",
    maxBitrate: 3500,
    maxResolution: "1080p30",
  },
  {
    id: "rumble",
    name: "rumble",
    displayName: "Rumble",
    logo: "🎯",
    logoUrl: "/logos/rumble-logo.png",
    color: "#85C742",
    category: "Alternative",
    streamEndpoint: "rtmp://live.rumble.com/live",
    maxBitrate: 6000,
    maxResolution: "1080p60",
  },
  {
    id: "odysee",
    name: "odysee",
    displayName: "Odysee",
    logo: "🌊",
    logoUrl: "/logos/odysee-logo.png",
    color: "#EF4444",
    category: "Alternative",
    streamEndpoint: "rtmp://stream.odysee.com/live",
    maxBitrate: 8000,
    maxResolution: "4K30",
  },
  {
    id: "linkedin",
    name: "linkedin",
    displayName: "LinkedIn Live",
    logo: "💼",
    logoUrl: "/logos/linkedin-logo.png",
    color: "#0A66C2",
    category: "Professional",
    streamEndpoint: "rtmp://1-rtmp.linkedin.com/live",
    maxBitrate: 4000,
    maxResolution: "1080p30",
  },
  {
    id: "vimeo",
    name: "vimeo",
    displayName: "Vimeo Live",
    logo: "🎬",
    logoUrl: "/logos/vimeo-logo.png",
    color: "#1AB7EA",
    category: "Professional",
    streamEndpoint: "rtmp://rtmp.vimeo.com/live",
    maxBitrate: 10000,
    maxResolution: "4K30",
  },
]

interface AddPlatformModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPlatform: (platform: Platform) => void
  existingPlatforms: string[]
}

export function AddPlatformModal({ isOpen, onClose, onAddPlatform, existingPlatforms }: AddPlatformModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  if (!isOpen) return null

  const categories = ["All", "Gaming", "Social", "Video", "Alternative", "Professional"]

  const filteredPlatforms = AVAILABLE_PLATFORMS.filter((platform) => {
    const matchesSearch = platform.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || platform.category === selectedCategory
    const notAlreadyAdded = !existingPlatforms.includes(platform.id)
    return matchesSearch && matchesCategory && notAlreadyAdded
  })

  const handleAddPlatform = (platform: Platform) => {
    onAddPlatform(platform)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-gray-900 border-gray-700 w-full max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-white">Add Streaming Platform</CardTitle>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Search and Filter - Fixed at top */}
          <div className="p-6 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search platforms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    size="sm"
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Scrollable Platform Grid */}
          <div className="p-6 max-h-[60vh] overflow-y-auto overscroll-contain">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlatforms.map((platform) => (
                <Card
                  key={platform.id}
                  className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer hover:scale-105"
                  onClick={() => handleAddPlatform(platform)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundColor: `${platform.color}20`,
                            border: `1px solid ${platform.color}40`,
                          }}
                        >
                          <img
                            src={platform.logoUrl || "/placeholder.svg"}
                            alt={platform.displayName}
                            className="w-8 h-8 object-cover rounded"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              const parent = e.currentTarget.parentElement
                              if (parent) {
                                const fallback = document.createElement("span")
                                fallback.className = "text-xl"
                                fallback.textContent = platform.logo
                                parent.appendChild(fallback)
                              }
                            }}
                          />
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
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>Max: {platform.maxResolution}</span>
                        <span>•</span>
                        <span>{platform.maxBitrate} kbps</span>
                      </div>
                      <div className="text-xs text-gray-500 truncate">{platform.streamEndpoint}</div>
                    </div>

                    <Button
                      size="sm"
                      className="w-full"
                      style={{
                        backgroundColor: platform.color,
                        color: "white",
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddPlatform(platform)
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Platform
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPlatforms.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">No platforms found matching your criteria.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
