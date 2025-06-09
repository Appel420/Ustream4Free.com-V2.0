"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Music,
  Upload,
  Plus,
  Trash2,
  List,
  Grid,
  Search,
  Video,
  ImageIcon,
  FileText,
} from "lucide-react"

interface MediaItem {
  id: string
  name: string
  type: "audio" | "video" | "image"
  duration: string
  file: string
  isPlaying?: boolean
}

interface StreamPlaylistProps {
  onMediaChange?: (media: MediaItem | null) => void
  isStreamingToLayout?: boolean
}

export function StreamPlaylist({ onMediaChange, isStreamingToLayout = false }: StreamPlaylistProps) {
  const [playlist, setPlaylist] = useState<MediaItem[]>([
    { id: "1", name: "Intro Video", type: "video", duration: "0:30", file: "intro.mp4" },
    { id: "2", name: "Background Music", type: "audio", duration: "3:45", file: "bg-music.mp3" },
    { id: "3", name: "Overlay Image", type: "image", duration: "∞", file: "overlay.png" },
    { id: "4", name: "Outro Video", type: "video", duration: "0:45", file: "outro.mp4" },
  ])

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")
  const [currentTime, setCurrentTime] = useState(0)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [externalUrl, setExternalUrl] = useState("")
  const [isAddingExternal, setIsAddingExternal] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter playlist based on search
  const filteredPlaylist = playlist.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Simulate playback time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && playlist[currentTrack]) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const duration = playlist[currentTrack].duration
          if (prev >= parseDuration(duration)) {
            nextTrack()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, currentTrack, playlist])

  // Notify parent component of media changes
  useEffect(() => {
    if (onMediaChange) {
      onMediaChange(isPlaying ? playlist[currentTrack] : null)
    }
  }, [isPlaying, currentTrack, playlist, onMediaChange])

  const parseDuration = (duration: string): number => {
    const [mins, secs] = duration.split(":").map(Number)
    return mins * 60 + secs
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (repeatMode === "one") {
      setCurrentTime(0)
      return
    }

    let nextIndex
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length)
    } else {
      nextIndex = (currentTrack + 1) % playlist.length
    }

    if (nextIndex === 0 && repeatMode === "off") {
      setIsPlaying(false)
    }

    setCurrentTrack(nextIndex)
    setCurrentTime(0)
  }

  const prevTrack = () => {
    const prevIndex = (currentTrack - 1 + playlist.length) % playlist.length
    setCurrentTrack(prevIndex)
    setCurrentTime(0)
  }

  const playTrack = (index: number) => {
    setCurrentTrack(index)
    setCurrentTime(0)
    setIsPlaying(true)
  }

  const addExternalMedia = () => {
    if (!externalUrl.trim()) return

    const isVideo =
      /\.(mp4|webm|ogg|mov|avi)$/i.test(externalUrl) || externalUrl.includes("youtube") || externalUrl.includes("vimeo")
    const isAudio = /\.(mp3|wav|aac)$/i.test(externalUrl)
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(externalUrl)

    const newItem: MediaItem = {
      id: Date.now().toString(),
      name: `External ${isVideo ? "Video" : isAudio ? "Audio" : isImage ? "Image" : "File"}`,
      type: isVideo ? "video" : isAudio ? "audio" : isImage ? "image" : "file",
      duration: "∞", // Will be detected when loaded
      file: externalUrl,
    }

    setPlaylist([...playlist, newItem])
    setExternalUrl("")
    setIsAddingExternal(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const isVideo = file.type.startsWith("video/")
      const isAudio = file.type.startsWith("audio/")
      const isImage = file.type.startsWith("image/")

      if (isVideo || isAudio || isImage) {
        const newItem: MediaItem = {
          id: Date.now().toString() + Math.random(),
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: isVideo ? "video" : isAudio ? "audio" : isImage ? "image" : "file",
          duration: "∞", // Will be detected when loaded
          file: file.name,
        }

        setPlaylist((prev) => [...prev, newItem])
      }
    })

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeItem = (id: string) => {
    setPlaylist(playlist.filter((item) => item.id !== id))
  }

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newPlaylist = [...playlist]
    const [movedItem] = newPlaylist.splice(fromIndex, 1)
    newPlaylist.splice(toIndex, 0, movedItem)
    setPlaylist(newPlaylist)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />
      case "audio":
        return <Music className="h-4 w-4" />
      case "image":
        return <ImageIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <List className="h-5 w-5" />
            Stream Playlist
          </CardTitle>
          <div className="flex items-center gap-2">
            {isStreamingToLayout && <Badge className="bg-red-600 animate-pulse">STREAMING TO LAYOUT</Badge>}
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {playlist.length} items
            </Badge>
            <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Upload className="h-4 w-4 mr-1" />
              Add Media
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs defaultValue="player" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="player">Player</TabsTrigger>
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
            <TabsTrigger value="sources">Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="player" className="space-y-4">
            {/* Current Track Display */}
            {playlist[currentTrack] && (
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center text-2xl">
                    {getTypeIcon(playlist[currentTrack].type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{playlist[currentTrack].name}</h4>
                    <p className="text-sm text-gray-400">
                      {playlist[currentTrack].type} • {playlist[currentTrack].duration}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {playlist[currentTrack].type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white">{formatTime(currentTime)}</div>
                    <div className="text-xs text-gray-400">{playlist[currentTrack].duration}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <Slider
                    value={[currentTime]}
                    max={parseDuration(playlist[currentTrack].duration)}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setCurrentTime(value[0])}
                  />
                </div>
              </div>
            )}

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsShuffled(!isShuffled)}
                className={`border-gray-600 ${isShuffled ? "bg-purple-600 text-white" : "text-white hover:bg-gray-800"}`}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={prevTrack}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                onClick={togglePlay}
                className={isPlaying ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={nextTrack}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const modes: ("off" | "one" | "all")[] = ["off", "one", "all"]
                  const currentIndex = modes.indexOf(repeatMode)
                  setRepeatMode(modes[(currentIndex + 1) % modes.length])
                }}
                className={`border-gray-600 ${repeatMode !== "off" ? "bg-purple-600 text-white" : "text-white hover:bg-gray-800"}`}
              >
                <Repeat className="h-4 w-4" />
                {repeatMode === "one" && <span className="text-xs ml-1">1</span>}
              </Button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsMuted(!isMuted)}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider value={isMuted ? [0] : volume} max={100} step={1} className="flex-1" onValueChange={setVolume} />
              <span className="text-sm text-gray-400 w-10">{isMuted ? 0 : volume[0]}%</span>
            </div>

            {/* Stream to Layout Toggle */}
            <div className="flex items-center justify-between bg-blue-900/30 rounded-lg p-3">
              <div>
                <span className="text-sm text-white">Stream to Layout</span>
                <div className="text-xs text-gray-400">Send audio/video to stream layout</div>
              </div>
              <Switch checked={isStreamingToLayout} />
            </div>
          </TabsContent>

          <TabsContent value="playlist" className="space-y-4">
            {/* Search and View Controls */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search playlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                {viewMode === "list" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </Button>
            </div>

            {/* Playlist Items */}
            <div
              className={`space-y-2 max-h-64 overflow-y-auto ${viewMode === "grid" ? "grid grid-cols-2 gap-2" : ""}`}
            >
              {filteredPlaylist.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentTrack
                      ? "bg-purple-600/50 text-white"
                      : "bg-gray-800/30 hover:bg-gray-700/50 text-gray-300"
                  }`}
                  onClick={() => playTrack(index)}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", index.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault()
                    const fromIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))
                    moveItem(fromIndex, index)
                  }}
                >
                  <div className="text-xl">{getTypeIcon(item.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <span className="text-xs text-gray-400">{item.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.id)
                      }}
                      className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            {/* Upload Local Files */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Upload Local Files</h4>
              <div className="flex gap-2">
                <Button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Audio/Video/Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="audio/*,video/*,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Add External Source */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">External Sources</h4>
              {isAddingExternal ? (
                <div className="space-y-2">
                  <Input
                    placeholder="Enter URL (YouTube, direct link, etc.)"
                    value={externalUrl}
                    onChange={(e) => setExternalUrl(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                  <div className="flex gap-2">
                    <Button onClick={addExternalMedia} className="bg-green-600 hover:bg-green-700">
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingExternal(false)}
                      className="border-gray-600 text-white hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsAddingExternal(true)} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add External Source
                </Button>
              )}
            </div>

            {/* Quick Add Presets */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-white">Quick Add</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                  onClick={() => {
                    const newItem: MediaItem = {
                      id: Date.now().toString(),
                      name: "BRB Screen",
                      type: "video",
                      duration: "300",
                      file: "brb-screen.mp4",
                    }
                    setPlaylist([...playlist, newItem])
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  BRB Screen
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-white hover:bg-gray-800"
                  onClick={() => {
                    const newItem: MediaItem = {
                      id: Date.now().toString(),
                      name: "Starting Soon",
                      type: "video",
                      duration: "600",
                      file: "starting-soon.mp4",
                    }
                    setPlaylist([...playlist, newItem])
                  }}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Starting Soon
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
