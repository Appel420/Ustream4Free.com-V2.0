"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Edit, Trash2, Monitor, Camera, Mic, ImageIcon, Type, Settings } from "lucide-react"

export function SceneManager() {
  const [scenes, setScenes] = useState([
    { id: 1, name: "Main Scene", isActive: true, sources: ["Webcam", "Game Capture", "Overlay"] },
    { id: 2, name: "Just Chatting", isActive: false, sources: ["Webcam", "Chat Box", "Background"] },
    { id: 3, name: "BRB Scene", isActive: false, sources: ["BRB Image", "Music Visualizer"] },
    { id: 4, name: "Starting Soon", isActive: false, sources: ["Countdown Timer", "Background Music"] },
  ])

  const [sources] = useState([
    { id: 1, name: "Webcam", type: "camera", icon: Camera },
    { id: 2, name: "Game Capture", type: "display", icon: Monitor },
    { id: 3, name: "Microphone", type: "audio", icon: Mic },
    { id: 4, name: "Overlay", type: "image", icon: ImageIcon },
    { id: 5, name: "Chat Box", type: "text", icon: Type },
    { id: 6, name: "Background", type: "image", icon: ImageIcon },
  ])

  const setActiveScene = (sceneId: number) => {
    setScenes((prev) =>
      prev.map((scene) => ({
        ...scene,
        isActive: scene.id === sceneId,
      })),
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Scene Manager
          </CardTitle>
          <CardDescription className="text-slate-300">Manage your streaming scenes and sources</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Scenes</h3>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Scene
            </Button>
          </div>

          <div className="space-y-3">
            {scenes.map((scene) => (
              <Card key={scene.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        onClick={() => setActiveScene(scene.id)}
                        className={scene.isActive ? "bg-red-600 hover:bg-red-700" : "bg-gray-600 hover:bg-gray-700"}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <div>
                        <h4 className="font-medium">{scene.name}</h4>
                        <p className="text-sm text-slate-300">{scene.sources.length} sources</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {scene.isActive && <Badge className="bg-red-600">LIVE</Badge>}
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {scene.sources.map((source, index) => (
                      <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                        {source}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Sources</h3>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Source
            </Button>
          </div>

          <div className="space-y-3">
            {sources.map((source) => {
              const IconComponent = source.icon
              return (
                <Card key={source.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-slate-300 capitalize">{source.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Scene Preview */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle>Scene Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-2xl text-gray-400">
            🎬 Live Preview - {scenes.find((s) => s.isActive)?.name || "No Active Scene"}
          </div>
          <div className="mt-4 flex justify-center gap-4">
            <Button className="bg-green-600 hover:bg-green-700">Start Recording</Button>
            <Button className="bg-red-600 hover:bg-red-700">Go Live</Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
              Take Screenshot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
