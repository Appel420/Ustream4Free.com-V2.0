"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mic, MicOff, Volume2, VolumeX, Monitor, Camera, Headphones, Settings } from "lucide-react"

export function AudioVideoControls() {
  const [audioDevices] = useState([
    { id: 1, name: "Blue Yeti Microphone", type: "input", enabled: true, volume: 75, muted: false },
    { id: 2, name: "Desktop Audio", type: "output", enabled: true, volume: 60, muted: false },
    { id: 3, name: "Game Audio", type: "output", enabled: true, volume: 80, muted: false },
    { id: 4, name: "Music Player", type: "output", enabled: false, volume: 45, muted: true },
  ])

  const [videoDevices] = useState([
    { id: 1, name: "Logitech C920 Webcam", type: "camera", enabled: true, resolution: "1920x1080", fps: 60 },
    { id: 2, name: "Game Capture", type: "capture", enabled: true, resolution: "1920x1080", fps: 60 },
    { id: 3, name: "Screen Capture", type: "screen", enabled: false, resolution: "1920x1080", fps: 30 },
  ])

  const [audioSettings, setAudioSettings] = useState({
    noiseSuppression: true,
    noiseGate: false,
    compressor: true,
    limiter: true,
    monitoring: false,
  })

  const [videoSettings, setVideoSettings] = useState({
    chromaKey: false,
    colorCorrection: true,
    sharpening: false,
    deinterlacing: false,
  })

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Audio & Video Controls
          </CardTitle>
          <CardDescription className="text-slate-300">
            Professional audio and video management for your streams
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="audio" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md">
          <TabsTrigger value="audio">Audio Mixer</TabsTrigger>
          <TabsTrigger value="video">Video Sources</TabsTrigger>
          <TabsTrigger value="filters">Filters & Effects</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="audio" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audio Mixer */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Audio Mixer</h3>

              {audioDevices.map((device) => (
                <Card key={device.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {device.type === "input" ? (
                          device.muted ? (
                            <MicOff className="h-5 w-5 text-red-400" />
                          ) : (
                            <Mic className="h-5 w-5 text-green-400" />
                          )
                        ) : device.muted ? (
                          <VolumeX className="h-5 w-5 text-red-400" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-green-400" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{device.name}</p>
                          <p className="text-xs text-slate-300 capitalize">{device.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={device.enabled} />
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs w-12">Volume</span>
                        <Slider value={[device.volume]} max={100} step={1} className="flex-1" />
                        <span className="text-xs w-8">{device.volume}%</span>
                      </div>

                      {/* Audio Level Meter */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs w-12">Level</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                            style={{ width: `${Math.random() * 80 + 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Audio Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Audio Processing</h3>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Filters & Effects</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(audioSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setAudioSettings((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Headphones className="h-5 w-5" />
                    <span>Monitor Audio Output</span>
                    <Switch checked={audioSettings.monitoring} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-lg font-bold text-green-400">-12 dB</p>
                      <p className="text-xs text-slate-300">Peak Level</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-lg font-bold text-blue-400">-18 dB</p>
                      <p className="text-xs text-slate-300">RMS Level</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Sources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Video Sources</h3>

              {videoDevices.map((device) => (
                <Card key={device.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {device.type === "camera" && <Camera className="h-5 w-5 text-blue-400" />}
                        {device.type === "capture" && <Monitor className="h-5 w-5 text-green-400" />}
                        {device.type === "screen" && <Monitor className="h-5 w-5 text-purple-400" />}
                        <div>
                          <p className="font-medium text-sm">{device.name}</p>
                          <p className="text-xs text-slate-300">
                            {device.resolution} @ {device.fps}fps
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={device.enabled} />
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-gray-400 text-sm">
                      📹 {device.name} Preview
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Video Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Video Processing</h3>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Video Filters</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(videoSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setVideoSettings((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Stream Quality</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-300">Resolution</label>
                      <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white text-sm">
                        <option>1920x1080</option>
                        <option>1280x720</option>
                        <option>854x480</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-slate-300">Frame Rate</label>
                      <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white text-sm">
                        <option>60 FPS</option>
                        <option>30 FPS</option>
                        <option>24 FPS</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-300">Video Bitrate (kbps)</label>
                    <Slider defaultValue={[6000]} max={10000} min={1000} step={100} className="mt-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Chroma Key", description: "Remove green screen background", enabled: false },
              { name: "Color Correction", description: "Adjust brightness, contrast, saturation", enabled: true },
              { name: "Noise Reduction", description: "Reduce video noise and grain", enabled: false },
              { name: "Sharpening", description: "Enhance image sharpness", enabled: false },
              { name: "Blur", description: "Add blur effect to background", enabled: false },
              { name: "Crop/Pad", description: "Crop or add padding to video", enabled: false },
            ].map((filter, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{filter.name}</h4>
                    <Switch checked={filter.enabled} />
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{filter.description}</p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Encoding Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300">Encoder</label>
                  <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white">
                    <option>Hardware (NVENC)</option>
                    <option>Software (x264)</option>
                    <option>Hardware (AMD)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Rate Control</label>
                  <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white">
                    <option>CBR (Constant Bitrate)</option>
                    <option>VBR (Variable Bitrate)</option>
                    <option>CQP (Constant Quality)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-slate-300">Keyframe Interval</label>
                  <input
                    type="number"
                    defaultValue="2"
                    className="w-full p-2 bg-white/20 border border-white/30 rounded text-white"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-green-400">45%</p>
                    <p className="text-xs text-slate-300">CPU Usage</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-blue-400">62%</p>
                    <p className="text-xs text-slate-300">GPU Usage</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-purple-400">60</p>
                    <p className="text-xs text-slate-300">FPS</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-lg font-bold text-yellow-400">0</p>
                    <p className="text-xs text-slate-300">Dropped Frames</p>
                  </div>
                </div>

                <Button className="w-full bg-red-600 hover:bg-red-700">Reset to Defaults</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
