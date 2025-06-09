"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Edit, Key, Globe, Settings } from "lucide-react"

export function PlatformManager() {
  const [platforms, setPlatforms] = useState([
    { id: "twitch", name: "Twitch", logo: "🟣", rtmpUrl: "rtmp://live.twitch.tv/live/", enabled: true },
    { id: "youtube", name: "YouTube Live", logo: "🔴", rtmpUrl: "rtmp://a.rtmp.youtube.com/live2/", enabled: true },
    {
      id: "facebook",
      name: "Facebook Live",
      logo: "🔵",
      rtmpUrl: "rtmps://live-api-s.facebook.com:443/rtmp/",
      enabled: false,
    },
    { id: "tiktok", name: "TikTok Live", logo: "⚫", rtmpUrl: "rtmp://push.tiktokcdn.com/live/", enabled: false },
    { id: "discord", name: "Discord", logo: "🟦", rtmpUrl: "rtmp://discord.com/api/", enabled: true },
    { id: "kick", name: "Kick", logo: "🟢", rtmpUrl: "rtmp://ingest.kick.com/live/", enabled: false },
  ])

  const [newPlatform, setNewPlatform] = useState({ name: "", logo: "", rtmpUrl: "" })

  const addPlatform = () => {
    if (newPlatform.name && newPlatform.rtmpUrl) {
      setPlatforms((prev) => [
        ...prev,
        {
          id: newPlatform.name.toLowerCase().replace(/\s+/g, "-"),
          name: newPlatform.name,
          logo: newPlatform.logo || "🌐",
          rtmpUrl: newPlatform.rtmpUrl,
          enabled: false,
        },
      ])
      setNewPlatform({ name: "", logo: "", rtmpUrl: "" })
    }
  }

  const removePlatform = (id: string) => {
    setPlatforms((prev) => prev.filter((p) => p.id !== id))
  }

  const togglePlatform = (id: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Platform Management
          </CardTitle>
          <CardDescription className="text-slate-300">
            Manage your streaming platforms and configure multiple stream keys per platform
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="platforms" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md">
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="keys">Stream Keys</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="platforms" className="space-y-4">
          {/* Add New Platform */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="text-lg">Add New Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    placeholder="e.g., Custom RTMP"
                    value={newPlatform.name}
                    onChange={(e) => setNewPlatform((prev) => ({ ...prev, name: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="platform-logo">Logo Emoji</Label>
                  <Input
                    id="platform-logo"
                    placeholder="🌐"
                    value={newPlatform.logo}
                    onChange={(e) => setNewPlatform((prev) => ({ ...prev, logo: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="rtmp-url">RTMP URL</Label>
                  <Input
                    id="rtmp-url"
                    placeholder="rtmp://example.com/live/"
                    value={newPlatform.rtmpUrl}
                    onChange={(e) => setNewPlatform((prev) => ({ ...prev, rtmpUrl: e.target.value }))}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
              </div>
              <Button onClick={addPlatform} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Platform
              </Button>
            </CardContent>
          </Card>

          {/* Platform List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <Card key={platform.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.logo}</span>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-slate-300 text-sm">{platform.rtmpUrl}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={platform.enabled ? "default" : "secondary"}>
                      {platform.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => togglePlatform(platform.id)}
                      className={platform.enabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                    >
                      {platform.enabled ? "Disable" : "Enable"}
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => removePlatform(platform.id)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keys" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {platforms
              .filter((p) => p.enabled)
              .map((platform) => (
                <Card key={platform.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <span className="text-xl">{platform.logo}</span>
                      {platform.name} Stream Keys
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3, 4, 5].map((keyNum) => (
                      <div key={keyNum} className="flex items-center gap-4">
                        <Label className="w-16">Key {keyNum}:</Label>
                        <Input
                          placeholder={`Enter ${platform.name} stream key ${keyNum}`}
                          className="flex-1 bg-white/20 border-white/30 text-white"
                        />
                        <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                          <Key className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Global Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Stream Quality</h3>
                  <div className="space-y-2">
                    <Label>Video Bitrate (kbps)</Label>
                    <Input defaultValue="6000" className="bg-white/20 border-white/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Audio Bitrate (kbps)</Label>
                    <Input defaultValue="160" className="bg-white/20 border-white/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white">
                      <option value="1920x1080">1920x1080 (1080p)</option>
                      <option value="1280x720">1280x720 (720p)</option>
                      <option value="854x480">854x480 (480p)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Advanced Settings</h3>
                  <div className="space-y-2">
                    <Label>Keyframe Interval</Label>
                    <Input defaultValue="2" className="bg-white/20 border-white/30 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label>CPU Usage Preset</Label>
                    <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white">
                      <option value="ultrafast">Ultra Fast</option>
                      <option value="superfast">Super Fast</option>
                      <option value="veryfast">Very Fast</option>
                      <option value="faster">Faster</option>
                      <option value="fast">Fast</option>
                      <option value="medium">Medium</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Profile</Label>
                    <select className="w-full p-2 bg-white/20 border border-white/30 rounded text-white">
                      <option value="baseline">Baseline</option>
                      <option value="main">Main</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button className="bg-purple-600 hover:bg-purple-700">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
