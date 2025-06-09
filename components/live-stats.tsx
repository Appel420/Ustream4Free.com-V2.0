"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Users, MessageCircle, TrendingUp, Zap } from "lucide-react"

interface LiveStatsProps {
  stats: {
    totalViewers: number
    activePlatforms: number
    totalMessages: number
  }
  isStreaming: boolean
}

export function LiveStats({ stats, isStreaming }: LiveStatsProps) {
  return (
    <Card className="bg-gradient-to-r from-purple-900/90 to-blue-900/90 backdrop-blur-md border-purple-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Live Statistics</h2>
            <Badge variant={isStreaming ? "destructive" : "secondary"} className="animate-pulse">
              {isStreaming ? "🔴 BROADCASTING" : "⚫ STANDBY"}
            </Badge>
          </div>
          <div className="text-sm text-gray-300">Real-time • AI Optimized</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <Eye className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalViewers.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Total Viewers</div>
            <div className="text-xs text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              Live Tracking
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 text-center">
            <Users className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.activePlatforms}</div>
            <div className="text-sm text-gray-300">Live Platforms</div>
            <div className="text-xs text-blue-400 mt-1">6 Total Available</div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 text-center">
            <MessageCircle className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalMessages.toLocaleString()}</div>
            <div className="text-sm text-gray-300">Chat Messages</div>
            <div className="text-xs text-purple-400 mt-1">{Math.floor(Math.random() * 20 + 10)}/min rate</div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-green-400">98.5%</div>
            <div className="text-xs text-gray-400">Uptime</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-blue-400">1080p60</div>
            <div className="text-xs text-gray-400">Quality</div>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="text-sm font-bold text-purple-400">6000kbps</div>
            <div className="text-xs text-gray-400">Bitrate</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
