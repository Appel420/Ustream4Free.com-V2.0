"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Video,
  Camera,
  Monitor,
  Upload,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Settings,
  Maximize,
  Eye,
} from "lucide-react"

export function VideoManager() {
  const [activeSource, setActiveSource] = useState("webcam")
  const [isRecording, setIsRecording] = useState(false)
  const [videoSources] = useState([
    { id: "webcam", name: "Webcam", type: "camera", active: true, resolution: "1080p", fps: 60 },
    { id: "screen", name: "Screen Capture", type: "screen", active: false, resolution: "1080p", fps: 30 },
    { id: "game", name: "Game Capture", type: "game", active: true, resolution: "1080p", fps: 60 },
    { id: "media", name: "Media Player", type: "media", active: false, resolution: "1080p", fps: 30 },
  ])

  const [videoFiles] = useState([
    { id: 1, name: "Intro Video.mp4", duration: "0:30", size: "45 MB", thumbnail: "🎬" },
    { id: 2, name: "Outro Animation.mp4", duration: "0:15", size: "23 MB", thumbnail: "🎭" },
    { id: 3, name: "BRB Screen.mp4", duration: "1:00", size: "67 MB", thumbnail: "⏸️" },
    { id: 4, name: "Transition Effect.mp4", duration: "0:05", size: "12 MB", thumbnail: "✨" },
  ])

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Video Sources */}
      <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white">
            <Video className="h-5 w-5" />
            Video Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {videoSources.map((source) => (
            <div key={source.id} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {source.type === "camera" && <Camera className="h-5 w-5 text-blue-400" />}
                  {source.type === "screen" && <Monitor className="h-5 w-5 text-green-400" />}
                  {source.type === "game" && <Video className="h-5 w-5 text-purple-400" />}
                  {source.type === "media" && <Play className="h-5 w-5 text-yellow-400" />}
                  <div>
                    <h4 className="font-medium text-white">{source.name}</h4>
                    <p className="text-xs text-gray-400">
                      {source.resolution} @ {source.fps}fps
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={source.active} />
                  <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Video Preview */}
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-gray-400 text-sm mb-3">
                {source.active ? (
                  <div className="text-center">
                    <div className="text-lg mb-1">
                      {source.type === "camera"
                        ? "📹"
                        : source.type === "screen"
                          ? "🖥️"
                          : source.type === "game"
                            ? "🎮"
                            : "📺"}
                    </div>
                    <div>{source.name} Preview</div>
                    {activeSource === source.id && <Badge className="bg-red-600 mt-2 animate-pulse">LIVE</Badge>}
                  </div>
                ) : (
                  <div>Source Disabled</div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setActiveSource(source.id)}
                  className={
                    activeSource === source.id ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"
                  }
                  disabled={!source.active}
                >
                  {activeSource === source.id ? "Live" : "Set Live"}
                </Button>
                <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  <Maximize className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
          ))}

          {/* Recording Controls */}
          <div className="bg-red-900/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-white">Recording</h4>
              <Badge variant={isRecording ? "destructive" : "secondary"}>{isRecording ? "🔴 REC" : "⚫ STOPPED"}</Badge>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleRecording}
                className={isRecording ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
              >
                {isRecording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <div className="mt-2 text-xs text-gray-400">
                Recording time: {Math.floor(Math.random() * 60)}:
                {Math.floor(Math.random() * 60)
                  .toString()
                  .padStart(2, "0")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Library */}
      <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="h-5 w-5" />
              Video Library
            </CardTitle>
            <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
              <Upload className="h-4 w-4 mr-1" />
              Upload Video
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {videoFiles.map((file) => (
            <div key={file.id} className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                  {file.thumbnail}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white">{file.name}</h4>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <span>Duration: {file.duration}</span>
                    <span>Size: {file.size}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Play className="h-3 w-3 mr-1" />
                    Play
                  </Button>
                  <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {/* Video Controls */}
          <div className="bg-purple-900/30 rounded-lg p-4">
            <h4 className="font-medium text-white mb-3">Media Controls</h4>
            <div className="flex items-center gap-2 mb-3">
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <Play className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Pause className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <SkipForward className="h-3 w-3" />
              </Button>
              <div className="flex-1 mx-3">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                </div>
              </div>
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                <Volume2 className="h-3 w-3" />
              </Button>
            </div>
            <div className="text-xs text-gray-400">Now Playing: Intro Video.mp4 • 0:15 / 0:30</div>
          </div>

          {/* Stream Integration */}
          <div className="bg-blue-900/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Stream Video</span>
              <Badge variant="outline" className="border-blue-500 text-blue-300">
                Ready
              </Badge>
            </div>
            <div className="text-xs text-gray-400 mt-1">Videos can be streamed to all active platforms</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
