"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Square,
  Mic,
  Video,
  Monitor,
  Music,
  Zap,
  Settings,
  ImageIcon,
  Volume2,
  VolumeX,
  MessageCircle,
  Bell,
  Gift,
  Heart,
  Smile,
  Camera,
  Maximize,
  Minimize,
  RefreshCw,
  Layers,
  Scissors,
  Coffee,
  Cpu,
  Database,
  Download,
  Upload,
  Eye,
  Filter,
  Flame,
  Gamepad2,
  Headphones,
  Layout,
  Lightbulb,
  List,
  Rocket,
  Share2,
  Shield,
  Sparkles,
  Timer,
  Clock,
  Users,
  UserPlus,
  Archive,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

interface StreamDeckProps {
  isStreaming: boolean
  onToggleStream: () => void
  onPlayIntro: () => void
  onPlayBRB: () => void
  onPlayOutro: () => void
}

// All 50 available actions for the stream deck
const availableActions = [
  { key: "stream", icon: Play, label: "Go Live", description: "Start/Stop streaming", color: "bg-green-600" },
  { key: "intro", icon: Play, label: "Play Intro", description: "Play stream intro video", color: "bg-blue-600" },
  { key: "brb", icon: Clock, label: "BRB Screen", description: "Show Be Right Back screen", color: "bg-yellow-600" },
  { key: "outro", icon: Square, label: "Play Outro", description: "Play stream outro video", color: "bg-red-600" },
  { key: "mic", icon: Mic, label: "Microphone", description: "Toggle microphone", color: "bg-orange-600" },
  { key: "camera", icon: Video, label: "Camera", description: "Toggle camera", color: "bg-purple-600" },
  { key: "screen", icon: Monitor, label: "Screen Share", description: "Share your screen", color: "bg-gray-600" },
  { key: "music", icon: Music, label: "Music Player", description: "Control music player", color: "bg-pink-600" },
  { key: "effects", icon: Zap, label: "Effects", description: "Toggle visual effects", color: "bg-yellow-600" },
  { key: "scene1", icon: ImageIcon, label: "Scene 1", description: "Switch to scene 1", color: "bg-indigo-600" },
  { key: "scene2", icon: ImageIcon, label: "Scene 2", description: "Switch to scene 2", color: "bg-indigo-600" },
  { key: "scene3", icon: ImageIcon, label: "Scene 3", description: "Switch to scene 3", color: "bg-indigo-600" },
  { key: "scene4", icon: ImageIcon, label: "Scene 4", description: "Switch to scene 4", color: "bg-indigo-600" },
  { key: "scene5", icon: ImageIcon, label: "Scene 5", description: "Switch to scene 5", color: "bg-indigo-600" },
  { key: "volume_up", icon: Volume2, label: "Volume Up", description: "Increase volume", color: "bg-green-600" },
  { key: "volume_down", icon: VolumeX, label: "Volume Down", description: "Decrease volume", color: "bg-red-600" },
  { key: "chat", icon: MessageCircle, label: "Chat Mode", description: "Focus on chat", color: "bg-blue-600" },
  { key: "alert", icon: Bell, label: "Alert", description: "Show an alert", color: "bg-yellow-600" },
  { key: "donation", icon: Gift, label: "Donation Alert", description: "Show donation alert", color: "bg-green-600" },
  { key: "like", icon: Heart, label: "Like Animation", description: "Show like animation", color: "bg-red-600" },
  { key: "emote", icon: Smile, label: "Emote Mode", description: "Emote-only chat", color: "bg-yellow-600" },
  { key: "snapshot", icon: Camera, label: "Screenshot", description: "Take a screenshot", color: "bg-gray-600" },
  { key: "fullscreen", icon: Maximize, label: "Fullscreen", description: "Toggle fullscreen", color: "bg-blue-600" },
  { key: "minimize", icon: Minimize, label: "Minimize", description: "Minimize windows", color: "bg-gray-600" },
  { key: "refresh", icon: RefreshCw, label: "Refresh", description: "Refresh sources", color: "bg-cyan-600" },
  { key: "layers", icon: Layers, label: "Layers", description: "Manage layers", color: "bg-purple-600" },
  { key: "cut", icon: Scissors, label: "Cut Scene", description: "Cut to next scene", color: "bg-red-600" },
  { key: "break", icon: Coffee, label: "Break Screen", description: "Show break screen", color: "bg-orange-600" },
  { key: "performance", icon: Cpu, label: "Performance", description: "Show performance stats", color: "bg-green-600" },
  { key: "save", icon: Database, label: "Save Settings", description: "Save current settings", color: "bg-blue-600" },
  { key: "download", icon: Download, label: "Download", description: "Download recording", color: "bg-green-600" },
  { key: "upload", icon: Upload, label: "Upload Media", description: "Upload media files", color: "bg-blue-600" },
  { key: "visibility", icon: Eye, label: "Show/Hide", description: "Toggle element visibility", color: "bg-gray-600" },
  { key: "filter", icon: Filter, label: "Video Filter", description: "Apply video filter", color: "bg-purple-600" },
  { key: "highlight", icon: Flame, label: "Highlight", description: "Create highlight clip", color: "bg-orange-600" },
  { key: "game", icon: Gamepad2, label: "Game Mode", description: "Optimize for gaming", color: "bg-green-600" },
  { key: "audio", icon: Headphones, label: "Audio Mixer", description: "Open audio mixer", color: "bg-blue-600" },
  { key: "layout", icon: Layout, label: "Layout", description: "Change stream layout", color: "bg-purple-600" },
  {
    key: "lighting",
    icon: Lightbulb,
    label: "Lighting",
    description: "Adjust lighting effects",
    color: "bg-yellow-600",
  },
  { key: "social", icon: Share2, label: "Social Media", description: "Post to social media", color: "bg-blue-600" },
  { key: "timer", icon: Timer, label: "Stream Timer", description: "Start/stop stream timer", color: "bg-orange-600" },
  { key: "followers", icon: Users, label: "Followers", description: "Show follower count", color: "bg-green-600" },
  { key: "playlist", icon: List, label: "Playlist", description: "Manage music playlist", color: "bg-pink-600" },
  { key: "record", icon: Archive, label: "Record", description: "Start/stop recording", color: "bg-red-600" },
  { key: "mute_all", icon: VolumeX, label: "Mute All", description: "Mute all audio sources", color: "bg-red-600" },
  {
    key: "unmute_all",
    icon: Volume2,
    label: "Unmute All",
    description: "Unmute all audio sources",
    color: "bg-green-600",
  },
  { key: "emergency", icon: Shield, label: "Emergency", description: "Emergency stream stop", color: "bg-red-600" },
  {
    key: "celebration",
    icon: Sparkles,
    label: "Celebration",
    description: "Celebration effects",
    color: "bg-yellow-600",
  },
  { key: "raid", icon: Rocket, label: "Raid Mode", description: "Prepare for raid", color: "bg-purple-600" },
  { key: "host", icon: UserPlus, label: "Host Mode", description: "Host another streamer", color: "bg-blue-600" },
]

export function StreamDeck({ isStreaming, onToggleStream, onPlayIntro, onPlayBRB, onPlayOutro }: StreamDeckProps) {
  // Stream deck with 12 customizable buttons (can be expanded)
  const [deckButtons, setDeckButtons] = useState([
    {
      key: "stream",
      icon: isStreaming ? Square : Play,
      label: isStreaming ? "Stop Stream" : "Go Live",
      active: isStreaming,
      color: isStreaming ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700",
      action: onToggleStream,
    },
    {
      key: "intro",
      icon: Play,
      label: "Play Intro",
      active: false,
      color: "bg-blue-600 hover:bg-blue-700",
      action: onPlayIntro,
    },
    {
      key: "brb",
      icon: Clock,
      label: "BRB Screen",
      active: false,
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: onPlayBRB,
    },
    {
      key: "outro",
      icon: Square,
      label: "Play Outro",
      active: false,
      color: "bg-red-600 hover:bg-red-700",
      action: onPlayOutro,
    },
    {
      key: "mic",
      icon: Mic,
      label: "Microphone",
      active: true,
      color: "bg-orange-600 hover:bg-orange-700",
      action: () => toggleDeckButton(4),
    },
    {
      key: "camera",
      icon: Video,
      label: "Camera",
      active: true,
      color: "bg-purple-600 hover:bg-purple-700",
      action: () => toggleDeckButton(5),
    },
    {
      key: "screen",
      icon: Monitor,
      label: "Screen Share",
      active: false,
      color: "bg-gray-600 hover:bg-gray-700",
      action: () => toggleDeckButton(6),
    },
    {
      key: "music",
      icon: Music,
      label: "Music Player",
      active: false,
      color: "bg-pink-600 hover:bg-pink-700",
      action: () => toggleDeckButton(7),
    },
    {
      key: "effects",
      icon: Zap,
      label: "Visual Effects",
      active: false,
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => toggleDeckButton(8),
    },
    {
      key: "chat",
      icon: MessageCircle,
      label: "Chat Focus",
      active: false,
      color: "bg-blue-600 hover:bg-blue-700",
      action: () => toggleDeckButton(9),
    },
    {
      key: "alert",
      icon: Bell,
      label: "Alert System",
      active: false,
      color: "bg-yellow-600 hover:bg-yellow-700",
      action: () => toggleDeckButton(10),
    },
    {
      key: "record",
      icon: Archive,
      label: "Record",
      active: false,
      color: "bg-red-600 hover:bg-red-700",
      action: () => toggleDeckButton(11),
    },
  ])

  const toggleDeckButton = (index: number) => {
    setDeckButtons((prev) => {
      const newButtons = [...prev]
      newButtons[index] = {
        ...newButtons[index],
        active: !newButtons[index].active,
      }
      return newButtons
    })
  }

  const changeButtonAction = (buttonIndex: number, actionKey: string) => {
    const action = availableActions.find((a) => a.key === actionKey)
    if (!action) return

    setDeckButtons((prev) => {
      const newButtons = [...prev]
      newButtons[buttonIndex] = {
        ...newButtons[buttonIndex],
        key: action.key,
        icon: action.icon,
        label: action.label,
        color: `${action.color} hover:${action.color.replace("600", "700")}`,
        action: () => {
          if (action.key === "intro") onPlayIntro()
          else if (action.key === "brb") onPlayBRB()
          else if (action.key === "outro") onPlayOutro()
          else if (action.key === "stream") onToggleStream()
          else toggleDeckButton(buttonIndex)
        },
      }
      return newButtons
    })
  }

  return (
    <Card className="bg-gray-900/90 backdrop-blur-md border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Stream Deck Pro</h3>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            50 Actions Available
          </Badge>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {deckButtons.map((button, index) => {
            const IconComponent = button.icon
            return (
              <Popover key={`${button.key}-${index}`}>
                <PopoverTrigger asChild>
                  <div className="relative group">
                    <Button
                      onClick={button.action}
                      className={`${button.color} h-20 w-full flex flex-col items-center justify-center gap-1 transition-all duration-200 transform hover:scale-105 text-white relative`}
                    >
                      <IconComponent className="h-6 w-6" />
                      <span className="text-xs font-medium text-center leading-tight px-1">{button.label}</span>
                      {button.active && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-gray-800 hover:bg-gray-700 border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 bg-gray-900 border-gray-700">
                  <div className="p-3 border-b border-gray-800">
                    <h4 className="font-medium text-white">Customize Button {index + 1}</h4>
                    <p className="text-xs text-gray-400">Choose from 50 available actions</p>
                  </div>
                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-1 gap-1 p-2">
                      {availableActions.map((action) => {
                        const ActionIcon = action.icon
                        return (
                          <Button
                            key={action.key}
                            variant="ghost"
                            className="justify-start px-2 py-1 h-auto text-white hover:bg-gray-800"
                            onClick={() => changeButtonAction(index, action.key)}
                          >
                            <ActionIcon className="h-4 w-4 mr-2" />
                            <div className="text-left">
                              <div className="text-sm">{action.label}</div>
                              <div className="text-xs text-gray-400">{action.description}</div>
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-green-400">OPTIMIZED</div>
            <div className="text-xs text-gray-400">AI Performance</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-blue-400">50</div>
            <div className="text-xs text-gray-400">Total Actions</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2">
            <div className="text-lg font-bold text-purple-400">{isStreaming ? "LIVE" : "READY"}</div>
            <div className="text-xs text-gray-400">Stream Status</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
