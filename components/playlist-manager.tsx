"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle, Upload, Trash2 } from "lucide-react"

interface PlaylistItem {
  id: string
  name: string
  type: "intro" | "brb" | "outro" | "music" | "video"
  duration: string
  file?: string
}

interface PlaylistManagerProps {
  onPlayIntro: () => void
  onPlayBRB: () => void
  onPlayOutro: () => void
}

export function PlaylistManager({ onPlayIntro, onPlayBRB, onPlayOutro }: PlaylistManagerProps) {
  const [playlists, setPlaylists] = useState({
    intro: [
      { id: "intro1", name: "Stream Starting Soon", type: "intro" as const, duration: "0:30", file: "intro.mp4" },
      { id: "intro2", name: "Welcome Animation", type: "intro" as const, duration: "0:15", file: "welcome.mp4" },
      { id: "intro3", name: "Logo Reveal", type: "intro" as const, duration: "0:10", file: "logo.mp4" },
    ],
    brb: [
      { id: "brb1", name: "Be Right Back", type: "brb" as const, duration: "LOOP", file: "brb.mp4" },
      { id: "brb2", name: "Technical Difficulties", type: "brb" as const, duration: "LOOP", file: "tech.mp4" },
      { id: "brb3", name: "Quick Break", type: "brb" as const, duration: "LOOP", file: "break.mp4" },
    ],
    outro: [
      { id: "outro1", name: "Thanks for Watching", type: "outro" as const, duration: "0:45", file: "thanks.mp4" },
      { id: "outro2", name: "Follow & Subscribe", type: "outro" as const, duration: "0:30", file: "follow.mp4" },
      { id: "outro3", name: "See You Next Time", type: "outro" as const, duration: "0:20", file: "goodbye.mp4" },
    ],
  })

  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [activePlaylist, setActivePlaylist] = useState<"intro" | "brb" | "outro">("intro")

  const playItem = (item: PlaylistItem) => {
    setCurrentlyPlaying(item.id)

    if (item.type === "intro") {
      onPlayIntro()
    } else if (item.type === "brb") {
      onPlayBRB()
    } else if (item.type === "outro") {
      onPlayOutro()
    }
  }

  const stopPlayback = () => {
    setCurrentlyPlaying(null)
  }

  const getPlaylistColor = (type: string) => {
    switch (type) {
      case "intro":
        return "#22c55e"
      case "brb":
        return "#f59e0b"
      case "outro":
        return "#ef4444"
      default:
        return "#6366f1"
    }
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center justify-between">
          <span>Stream Playlist Manager</span>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            Auto-Play Ready
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Playlist Tabs */}
        <div className="flex gap-2">
          {(["intro", "brb", "outro"] as const).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={activePlaylist === type ? "default" : "outline"}
              onClick={() => setActivePlaylist(type)}
              className={activePlaylist === type ? "" : "border-gray-600 text-gray-300 hover:bg-gray-800"}
              style={activePlaylist === type ? { backgroundColor: getPlaylistColor(type) } : {}}
            >
              {type.toUpperCase()} ({playlists[type].length})
            </Button>
          ))}
        </div>

        {/* Current Playlist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-white capitalize">{activePlaylist} Playlist</h4>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Upload className="h-4 w-4 mr-1" />
              Add Media
            </Button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {playlists[activePlaylist].map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-lg border transition-all ${
                  currentlyPlaying === item.id
                    ? "border-green-500 bg-green-500/10"
                    : "border-gray-700 bg-gray-800/50 hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-white">{item.name}</div>
                    <div className="text-sm text-gray-400">
                      {item.file} • {item.duration}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentlyPlaying === item.id ? (
                      <Button size="sm" onClick={stopPlayback} className="bg-red-600 hover:bg-red-700">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => playItem(item)}
                        style={{ backgroundColor: getPlaylistColor(item.type) }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">{currentlyPlaying ? "Now Playing" : "Ready to Play"}</div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="border-gray-600">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600">
                <Repeat className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600">
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Auto-Play Settings */}
        <div className="bg-blue-900/30 rounded-lg p-3">
          <div className="text-sm font-medium text-blue-300 mb-2">Auto-Play Settings</div>
          <div className="space-y-2 text-xs text-blue-200">
            <div>✓ Play intro when stream starts</div>
            <div>✓ Auto-switch to BRB when needed</div>
            <div>✓ Play outro when stream ends</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
