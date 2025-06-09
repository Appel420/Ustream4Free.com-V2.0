"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface ChatWindowProps {
  platform: {
    id: string
    name: string
    displayName: string
    logo: string
    color: string
    isOpen: boolean
  }
  onPopOut: (id: string) => void
  onClose: (id: string) => void
}

export function ChatWindow({ platform, onPopOut, onClose }: ChatWindowProps) {
  return (
    <div className="rounded-lg p-4 mb-4 border-2" style={{ borderColor: platform.color }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{platform.logo}</span>
          <span className="text-lg font-medium">{platform.displayName} Chat</span>
        </div>
        <div className="flex items-center gap-2">
          {platform.isOpen ? (
            <Button size="sm" variant="outline" className="border-gray-600" onClick={() => onClose(platform.id)}>
              <ExternalLink className="h-4 w-4 mr-2" /> Close
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => onPopOut(platform.id)}
            >
              <ExternalLink className="h-4 w-4 mr-2" /> Pop Out
            </Button>
          )}
        </div>
      </div>
      <div className="text-sm text-gray-400">{platform.isOpen ? "Window open" : "Click to open"}</div>
    </div>
  )
}

export function ChatManager() {
  const [chatWindows, setChatWindows] = useState([
    {
      id: "twitch",
      name: "twitch",
      displayName: "Twitch",
      logo: "🟣",
      color: "#9146FF",
      isOpen: true,
    },
    {
      id: "youtube",
      name: "youtube",
      displayName: "YouTube",
      logo: "🔴",
      color: "#FF0000",
      isOpen: false,
    },
    {
      id: "x",
      name: "x",
      displayName: "Twitter/X",
      logo: "🐦",
      color: "#000000",
      isOpen: false,
    },
    {
      id: "facebook",
      name: "facebook",
      displayName: "Facebook",
      logo: "🔵",
      color: "#1877F2",
      isOpen: false,
    },
  ])

  const popOutChat = (id: string) => {
    setChatWindows(chatWindows.map((w) => (w.id === id ? { ...w, isOpen: true } : w)))
  }

  const closeChat = (id: string) => {
    setChatWindows(chatWindows.map((w) => (w.id === id ? { ...w, isOpen: false } : w)))
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Chat Management</h2>
      <h3 className="text-xl font-medium mb-3">Chat Windows</h3>
      <div>
        {chatWindows.map((window) => (
          <ChatWindow key={window.id} platform={window} onPopOut={popOutChat} onClose={closeChat} />
        ))}
      </div>
    </div>
  )
}
