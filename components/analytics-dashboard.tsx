"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Users, Clock, DollarSign, Heart, MessageCircle, Download } from "lucide-react"

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("24h")
  const [analytics, setAnalytics] = useState({
    totalViews: 45678,
    peakViewers: 2341,
    avgViewTime: "12:34",
    totalRevenue: 1234.56,
    newFollowers: 156,
    chatMessages: 8934,
    streamUptime: "95.2%",
    engagement: "8.7%",
  })

  const platformStats = [
    { platform: "Twitch", logo: "🟣", viewers: 1234, revenue: 456.78, growth: "+12.5%" },
    { platform: "YouTube", logo: "🔴", viewers: 856, revenue: 234.56, growth: "+8.3%" },
    { platform: "Discord", logo: "🟦", viewers: 67, revenue: 12.5, growth: "+45.2%" },
    { platform: "TikTok", logo: "⚫", viewers: 2341, revenue: 534.72, growth: "+23.1%" },
  ]

  const recentStreams = [
    { date: "2024-01-15", duration: "3h 45m", peakViewers: 1456, revenue: 89.5 },
    { date: "2024-01-14", duration: "2h 30m", peakViewers: 1123, revenue: 67.25 },
    { date: "2024-01-13", duration: "4h 15m", peakViewers: 1789, revenue: 123.75 },
    { date: "2024-01-12", duration: "3h 20m", peakViewers: 1345, revenue: 78.9 },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription className="text-slate-300">
                Comprehensive streaming analytics and performance metrics
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {["24h", "7d", "30d", "90d"].map((range) => (
                <Button
                  key={range}
                  size="sm"
                  variant={timeRange === range ? "default" : "outline"}
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? "bg-purple-600" : "border-white/30 text-white hover:bg-white/20"}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/10 backdrop-blur-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Views</p>
                    <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                    <p className="text-xs opacity-75 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +15.3% vs last {timeRange}
                    </p>
                  </div>
                  <Users className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Peak Viewers</p>
                    <p className="text-2xl font-bold">{analytics.peakViewers.toLocaleString()}</p>
                    <p className="text-xs opacity-75 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8.7% vs last {timeRange}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Avg View Time</p>
                    <p className="text-2xl font-bold">{analytics.avgViewTime}</p>
                    <p className="text-xs opacity-75 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />
                      -2.1% vs last {timeRange}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Revenue</p>
                    <p className="text-2xl font-bold">${analytics.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs opacity-75 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +23.4% vs last {timeRange}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Streams */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader>
              <CardTitle>Recent Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentStreams.map((stream, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{stream.date}</p>
                        <p className="text-sm text-slate-300">Duration: {stream.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{stream.peakViewers.toLocaleString()} peak viewers</p>
                      <p className="text-sm text-green-400">${stream.revenue.toFixed(2)} revenue</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platformStats.map((platform, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{platform.logo}</span>
                      <CardTitle className="text-lg">{platform.platform}</CardTitle>
                    </div>
                    <Badge className="bg-green-600">{platform.growth}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-300">Current Viewers</p>
                      <p className="text-xl font-bold">{platform.viewers.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-300">Revenue</p>
                      <p className="text-xl font-bold">${platform.revenue.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${(platform.viewers / 2500) * 100}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">$856.32</div>
                <p className="text-sm text-slate-300">+18.5% this {timeRange}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">$234.56</div>
                <p className="text-sm text-slate-300">+12.3% this {timeRange}</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Ad Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-400">$143.68</div>
                <p className="text-sm text-slate-300">+8.9% this {timeRange}</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">New Followers</p>
                    <p className="text-2xl font-bold">{analytics.newFollowers}</p>
                  </div>
                  <Heart className="h-6 w-6 text-pink-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Chat Messages</p>
                    <p className="text-2xl font-bold">{analytics.chatMessages.toLocaleString()}</p>
                  </div>
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Stream Uptime</p>
                    <p className="text-2xl font-bold">{analytics.streamUptime}</p>
                  </div>
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">Engagement Rate</p>
                    <p className="text-2xl font-bold">{analytics.engagement}</p>
                  </div>
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">Export CSV</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Export PDF Report</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Schedule Email Report</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
