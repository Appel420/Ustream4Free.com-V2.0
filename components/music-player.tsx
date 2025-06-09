"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
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
  List,
  Upload,
} from "lucide-react"

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState([75])
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // 3 minutes default

  const playlist = [
    { id: 1, title: "Stream Intro Music", artist: "Ustream4Free", duration: 180, file: "intro.mp3" },
    { id: 2, title: "Background Beats", artist: "StreamBeats", duration: 240, file: "background.mp3" },
    { id: 3, title: "Gaming Vibes", artist: "GameMusic", duration: 200, file: "gaming.mp3" },
    { id: 4, title: "Chill Lofi", artist: "LofiBeats", duration: 220, file: "lofi.mp3" },
    { id: 5, title: "Outro Theme", artist: "Ustream4Free", duration: 160, file: "outro.mp3" },
  ]

  // Simulate playback time
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            // Auto-advance to next track
            nextTrack()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, duration])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    if (isShuffled) {
      setCurrentTrack(Math.floor(Math.random() * playlist.length))
    } else {
      setCurrentTrack((prev) => (prev + 1) % playlist.length)
    }
    setCurrentTime(0)
    setDuration(playlist[currentTrack].duration)
  }

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + playlist.length) % playlist.length)
    setCurrentTime(0)
    setDuration(playlist[currentTrack].duration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled)
  }

  const toggleRepeat = () => {
    const modes: ("off" | "one" | "all")[] = ["off", "one", "all"]
    const currentIndex = modes.indexOf(repeatMode)
    setRepeatMode(modes[(currentIndex + 1) % modes.length])
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white">
            <Music className="h-5 w-5" />
            Music Player
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-gray-600 text-gray-300">
              {playlist.length} tracks
            </Badge>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="h-4 w-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Track Info */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Music className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-white">{playlist[currentTrack].title}</h4>
              <p className="text-sm text-gray-400">{playlist[currentTrack].artist}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-white">{formatTime(currentTime)}</div>
              <div className="text-xs text-gray-400">{formatTime(duration)}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              className="w-full"
              onValueChange={(value) => setCurrentTime(value[0])}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="sm"
            className={`${isShuffled ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
            <span className="ml-1 text-xs">Shuffle</span>
          </Button>

          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={prevTrack}>
            <SkipBack className="h-4 w-4" />
            <span className="ml-1 text-xs">Previous</span>
          </Button>

          <Button
            size="lg"
            onClick={togglePlay}
            className={
              isPlaying ? "bg-red-600 hover:bg-red-700 text-white" : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
          </Button>

          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
            <span className="ml-1 text-xs">Next</span>
          </Button>

          <Button
            size="sm"
            className={`${repeatMode !== "off" ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-gray-700 hover:bg-gray-600 text-gray-300"}`}
            onClick={toggleRepeat}
          >
            <Repeat className="h-4 w-4" />
            <span className="ml-1 text-xs">Repeat</span>
            {repeatMode === "one" && <span className="text-xs ml-1">1</span>}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className={isMuted ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider value={isMuted ? [0] : volume} max={100} step={1} className="flex-1" onValueChange={setVolume} />
          <span className="text-sm text-gray-400 w-10">{isMuted ? 0 : volume[0]}%</span>
        </div>

        {/* Playlist */}
        <div className="bg-gray-800/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <List className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-white">Playlist</span>
          </div>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {playlist.map((track, index) => (
              <div
                key={track.id}
                onClick={() => {
                  setCurrentTrack(index)
                  setCurrentTime(0)
                  setDuration(track.duration)
                }}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  index === currentTrack ? "bg-purple-600/50 text-white" : "hover:bg-gray-700/50 text-gray-300"
                }`}
              >
                <div className="flex-1">
                  <div className="text-sm font-medium">{track.title}</div>
                  <div className="text-xs text-gray-400">{track.artist}</div>
                </div>
                <div className="text-xs text-gray-400">{formatTime(track.duration)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stream Integration */}
        <div className="bg-blue-900/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white">Stream Audio</span>
            <Badge variant="outline" className="border-blue-500 text-blue-300">
              {isPlaying ? "Broadcasting" : "Paused"}
            </Badge>
          </div>
          <div className="text-xs text-gray-400 mt-1">Music is being streamed to all active platforms</div>
        </div>
      </CardContent>
    </Card>
  )
}
