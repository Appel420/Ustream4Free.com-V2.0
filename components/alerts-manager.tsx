"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Heart, DollarSign, Users, Gift, Bell, Settings, Play } from "lucide-react"

export function AlertsManager() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "follow", enabled: true, sound: "chime.mp3", duration: 5, minAmount: 0 },
    { id: 2, type: "donation", enabled: true, sound: "cash.mp3", duration: 8, minAmount: 1 },
    { id: 3, type: "subscription", enabled: true, sound: "fanfare.mp3", duration: 10, minAmount: 0 },
    { id: 4, type: "raid", enabled: true, sound: "horn.mp3", duration: 12, minAmount: 5 },
  ])

  const [recentAlerts] = useState([
    { type: "follow", user: "NewViewer123", amount: 0, timestamp: "2 min ago", platform: "Twitch" },
    { type: "donation", user: "GenerousUser", amount: 25.0, timestamp: "5 min ago", platform: "YouTube" },
    { type: "subscription", user: "LoyalFan", amount: 4.99, timestamp: "8 min ago", platform: "Twitch" },
    { type: "raid", user: "FriendlyStreamer", amount: 50, timestamp: "15 min ago", platform: "Twitch" },
  ])

  const alertTypes = [
    { type: "follow", icon: Heart, label: "New Follower", color: "text-pink-400" },
    { type: "donation", icon: DollarSign, label: "Donation", color: "text-green-400" },
    { type: "subscription", icon: Users, label: "Subscription", color: "text-purple-400" },
    { type: "raid", icon: Zap, label: "Raid/Host", color: "text-yellow-400" },
    { type: "gift", icon: Gift, label: "Gift Sub", color: "text-blue-400" },
  ]

  const testAlert = (alertType: string) => {
    // Simulate alert test
    console.log(`Testing ${alertType} alert`)
  }

  const toggleAlert = (alertId: number) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, enabled: !alert.enabled } : alert)))
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Alerts & Notifications Manager
          </CardTitle>
          <CardDescription className="text-slate-300">
            Manage stream alerts, notifications, and viewer engagement features
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md">
          <TabsTrigger value="alerts">Alert Settings</TabsTrigger>
          <TabsTrigger value="recent">Recent Alerts</TabsTrigger>
          <TabsTrigger value="widgets">Stream Widgets</TabsTrigger>
          <TabsTrigger value="sounds">Sound Library</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Alert Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Alert Configuration</h3>

              {alertTypes.map((alertType) => {
                const alert = alerts.find((a) => a.type === alertType.type)
                const IconComponent = alertType.icon

                return (
                  <Card key={alertType.type} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <IconComponent className={`h-5 w-5 ${alertType.color}`} />
                          <span className="font-medium">{alertType.label}</span>
                        </div>
                        <Switch
                          checked={alert?.enabled || false}
                          onCheckedChange={() => alert && toggleAlert(alert.id)}
                        />
                      </div>

                      {alert?.enabled && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Duration (seconds)</Label>
                              <Input
                                type="number"
                                value={alert.duration}
                                className="bg-white/20 border-white/30 text-white text-sm"
                              />
                            </div>
                            {alertType.type === "donation" && (
                              <div>
                                <Label className="text-xs">Min Amount ($)</Label>
                                <Input
                                  type="number"
                                  value={alert.minAmount}
                                  className="bg-white/20 border-white/30 text-white text-sm"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => testAlert(alertType.type)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Test
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-white/30 text-white hover:bg-white/20"
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Customize
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Alert Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Alert Preview</h3>

              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-gray-400 mb-4">
                    🎬 Alert Preview Area
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700">Test Follow Alert</Button>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Test Donation Alert</Button>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">Test Subscription Alert</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alert Statistics */}
              <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="text-lg">Today's Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>New Followers</span>
                    <Badge className="bg-pink-600">+23</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Donations</span>
                    <Badge className="bg-green-600">$156.78</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscriptions</span>
                    <Badge className="bg-purple-600">+8</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Raids/Hosts</span>
                    <Badge className="bg-yellow-600">+3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert, index) => {
                  const alertType = alertTypes.find((t) => t.type === alert.type)
                  const IconComponent = alertType?.icon || Bell

                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${alertType?.color || "text-white"}`} />
                        <div>
                          <p className="font-medium">{alert.user}</p>
                          <p className="text-sm text-slate-300">
                            {alertType?.label}
                            {alert.amount > 0 && ` - $${alert.amount.toFixed(2)}`}
                            {alert.type === "raid" && ` - ${alert.amount} viewers`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400">{alert.timestamp}</p>
                        <Badge variant="outline" className="text-xs border-white/30 text-white">
                          {alert.platform}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widgets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Recent Followers", description: "Show latest followers", enabled: true },
              { name: "Donation Goal", description: "Track donation progress", enabled: true },
              { name: "Top Donators", description: "Display top contributors", enabled: false },
              { name: "Chat Box", description: "Live chat overlay", enabled: true },
              { name: "Now Playing", description: "Current music track", enabled: false },
              { name: "Social Media", description: "Social links display", enabled: true },
            ].map((widget, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{widget.name}</h4>
                    <Switch checked={widget.enabled} />
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{widget.description}</p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sounds" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle>Sound Library</CardTitle>
              <CardDescription className="text-slate-300">Manage alert sounds and audio files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "chime.mp3", type: "Follow", duration: "2s" },
                  { name: "cash.mp3", type: "Donation", duration: "3s" },
                  { name: "fanfare.mp3", type: "Subscription", duration: "5s" },
                  { name: "horn.mp3", type: "Raid", duration: "4s" },
                ].map((sound, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <p className="font-medium">{sound.name}</p>
                      <p className="text-sm text-slate-300">
                        {sound.type} • {sound.duration}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Button className="bg-blue-600 hover:bg-blue-700">Upload New Sound</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
