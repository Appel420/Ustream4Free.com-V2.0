"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface PlatformCardProps {
  platform: {
    id: string
    name: string
    displayName: string
    logo: string
    color: string
    isActive: boolean
    quality: string
  }
  onToggle: (id: string) => void
  onPopOut: (id: string) => void
}

export function PlatformCard({ platform, onToggle, onPopOut }: PlatformCardProps) {
  return (
    <div
      className="rounded-lg p-4 flex items-center justify-between"
      style={{
        backgroundColor: platform.isActive ? `${platform.color}20` : "transparent",
        border: `2px solid ${platform.isActive ? platform.color : "#333"}`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{platform.logo}</div>
        <div>
          <div className="text-xl font-medium text-white">{platform.displayName}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${platform.isActive ? "bg-green-500" : "bg-gray-500"}`}></div>
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
          </div>
        </div>
      </div>
      <Button onClick={() => onPopOut(platform.id)} className="bg-purple-600 hover:bg-purple-700 text-white">
        <ExternalLink className="h-4 w-4 mr-2" /> Pop Out
      </Button>
    </div>
  )
}

export function PlatformsList() {
  const [platforms, setPlatforms] = useState([
    {
      id: "twitch",
      name: "twitch",
      displayName: "Twitch",
      logo: "🟣",
      color: "#9146FF",
      isActive: true,
      quality: "1080p60",
    },
    {
      id: "youtube",
      name: "youtube",
      displayName: "YouTube",
      logo: "🔴",
      color: "#FF0000",
      isActive: true,
      quality: "1440p30",
    },
    {
      id: "x",
      name: "x",
      displayName: "Twitter/X",
      logo: "🐦",
      color: "#000000",
      isActive: true,
      quality: "720p30",
    },
    {
      id: "facebook",
      name: "facebook",
      displayName: "Facebook",
      logo: "🔵",
      color: "#1877F2",
      isActive: false,
      quality: "720p30",
    },
    {
      id: "tiktok",
      name: "tiktok",
      displayName: "TikTok",
      logo: "🎵",
      color: "#000000",
      isActive: true,
      quality: "4k30",
    },
    {
      id: "discord",
      name: "discord",
      displayName: "Discord",
      logo: "🟦",
      color: "#5865F2",
      isActive: true,
      quality: "1080p60",
    },
    {
      id: "kick",
      name: "kick",
      displayName: "Kick",
      logo: "🟢",
      color: "#53FC18",
      isActive: false,
      quality: "720p30",
    },
  ])

  const togglePlatform = (id: string) => {
    setPlatforms(platforms.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const popOutPlatform = (id: string) => {
    // This will be handled by the parent component
    console.log(`Pop out ${id}`)
  }

  return (
    <div className="space-y-4">
      {platforms.map((platform) => (
        <PlatformCard key={platform.id} platform={platform} onToggle={togglePlatform} onPopOut={popOutPlatform} />
      ))}
    </div>
  )
}
