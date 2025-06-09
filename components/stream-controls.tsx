"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Play, Square, Mic, Video, Volume2 } from "lucide-react"

export function StreamControls() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [micEnabled, setMicEnabled] = useState(true)
  const [cameraEnabled, setCameraEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [quality, setQuality] = useState("720p")

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stream Controls</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Button
          size="lg"
          className={`h-16 text-lg font-semibold ${
            isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => setIsStreaming(!isStreaming)}
        >
          {isStreaming ? (
            <>
              <Square className="h-5 w-5 mr-2" /> Stop Stream
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" /> Start Stream
            </>
          )}
        </Button>

        <Button
          size="lg"
          className="h-16 text-lg font-semibold bg-orange-600 hover:bg-orange-700"
          onClick={() => setMicEnabled(!micEnabled)}
        >
          <Mic className="h-5 w-5 mr-2" /> {micEnabled ? "Mute Mic" : "Unmute Mic"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-orange-400" />
              <span className="text-lg">Microphone</span>
            </div>
            <Switch checked={micEnabled} onCheckedChange={setMicEnabled} />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-blue-400" />
              <span className="text-lg">Camera</span>
            </div>
            <Switch checked={cameraEnabled} onCheckedChange={setCameraEnabled} />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-green-400" />
              <span className="text-lg">Audio</span>
            </div>
            <Switch checked={audioEnabled} onCheckedChange={setAudioEnabled} />
          </div>
        </div>

        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg">Quality</span>
            <select
              className="bg-gray-900 border border-gray-700 rounded p-2"
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
            >
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
              <option value="1440p">1440p</option>
              <option value="4k">4K</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
