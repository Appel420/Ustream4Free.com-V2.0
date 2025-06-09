"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { ExternalLink, Eye, MessageCircle, Heart, DollarSign, TrendingUp } from "lucide-react"

interface Platform {
  id: string
  name: string
  logo: string
  isActive: boolean
  viewers: number
  chatMessages: number
  followers: number
  donations: number
  streamKeys: string[]
  activeKeyIndex: number
}

interface StreamingDashboardProps {
  isStreaming: boolean
  setActiveStreams: (count: number) => void
  setTotalViewers: (count: number) => void
}

export function StreamingDashboard({ isStreaming, setActiveStreams, setTotalViewers }: StreamingDashboardProps) {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: "twitch",
      name: "Twitch",
      logo: "🟣",
      isActive: true,
      viewers: 1234,
      chatMessages: 45,
      followers: 15420,
      donations: 125.5,
      streamKeys: ["live_123456789", "live_987654321", "live_456789123", "live_789123456", "live_321654987"],
      activeKeyIndex: 0,
    },
    {
      id: "youtube",
      name: "YouTube Live",
      logo: "🔴",
      isActive: true,
      viewers: 856,
      chatMessages: 23,
      followers: 8930,
      donations: 89.25,
      streamKeys: ["yt_key_1", "yt_key_2", "yt_key_3", "yt_key_4", "yt_key_5"],
      activeKeyIndex: 0,
    },
    {
      id: "facebook",
      name: "Facebook Live",
      logo: "🔵",
      isActive: false,
      viewers: 432,
      chatMessages: 12,
      followers: 5670,
      donations: 45.75,
      streamKeys: ["fb_stream_1", "fb_stream_2", "fb_stream_3", "fb_stream_4", "fb_stream_5"],
      activeKeyIndex: 0,
    },
    {
      id: "tiktok",
      name: "TikTok Live",
      logo: "⚫",
      isActive: false,
      viewers: 2341,
      chatMessages: 89,
      followers: 23450,
      donations: 234.8,
      streamKeys: ["tt_live_1", "tt_live_2", "tt_live_3", "tt_live_4", "tt_live_5"],
      activeKeyIndex: 0,
    },
    {
      id: "discord",
      name: "Discord",
      logo: "🟦",
      isActive: true,
      viewers: 67,
      chatMessages: 156,
      followers: 890,
      donations: 12.5,
      streamKeys: ["dc_stream_1", "dc_stream_2", "dc_stream_3", "dc_stream_4", "dc_stream_5"],
      activeKeyIndex: 0,
    },
    {
      id: "kick",
      name: "Kick",
      logo: "🟢",
      isActive: false,
      viewers: 189,
      chatMessages: 34,
      followers: 1230,
      donations: 67.25,
      streamKeys: ["kick_key_1", "kick_key_2", "kick_key_3", "kick_key_4", "kick_key_5"],
      activeKeyIndex: 0,
    },
  ])

  const [popoutWindows, setPopoutWindows] = useState<Map<string, Window>>(new Map())

  useEffect(() => {
    const activeCount = platforms.filter((p) => p.isActive).length
    const totalViewers = platforms.reduce((sum, p) => (p.isActive ? sum + p.viewers : sum), 0)

    setActiveStreams(activeCount)
    setTotalViewers(totalViewers)
  }, [platforms, setActiveStreams, setTotalViewers])

  const togglePlatform = (platformId: string) => {
    setPlatforms((prev) => prev.map((p) => (p.id === platformId ? { ...p, isActive: !p.isActive } : p)))
  }

  const popOutStream = (platform: Platform) => {
    const existingPopup = popoutWindows.get(platform.id)
    if (existingPopup && !existingPopup.closed) {
      existingPopup.focus()
      return
    }

    const width = 1200
    const height = 800
    const left = Math.max(0, (screen.width - width) / 2)
    const top = Math.max(0, (screen.height - height) / 2)

    const popup = window.open(
      "",
      `${platform.id}-stream`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )

    if (popup) {
      setPopoutWindows((prev) => new Map(prev.set(platform.id, popup)))

      popup.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${platform.name} - StreamMaster Pro</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #fff;
              height: 100vh;
              overflow: hidden;
            }
            .container {
              display: grid;
              grid-template-columns: 2fr 1fr;
              height: 100vh;
              gap: 10px;
              padding: 10px;
            }
            .video-section {
              background: rgba(0,0,0,0.8);
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              overflow: hidden;
            }
            .video-header {
              padding: 15px 20px;
              background: rgba(255,255,255,0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .platform-info {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 18px;
              font-weight: bold;
            }
            .stream-stats {
              display: flex;
              gap: 20px;
              font-size: 14px;
            }
            .video-content {
              flex: 1;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 24px;
              color: #666;
            }
            .chat-section {
              background: rgba(255,255,255,0.1);
              border-radius: 12px;
              display: flex;
              flex-direction: column;
              backdrop-filter: blur(10px);
            }
            .chat-header {
              padding: 15px 20px;
              border-bottom: 1px solid rgba(255,255,255,0.2);
              font-weight: bold;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .chat-messages {
              flex: 1;
              padding: 15px;
              overflow-y: auto;
              min-height: 0;
            }
            .chat-message {
              margin-bottom: 12px;
              padding: 10px 15px;
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
              font-size: 14px;
              line-height: 1.4;
            }
            .chat-input-area {
              padding: 15px 20px;
              border-top: 1px solid rgba(255,255,255,0.2);
              display: flex;
              gap: 10px;
            }
            .chat-input {
              flex: 1;
              padding: 12px 16px;
              border: none;
              border-radius: 25px;
              background: rgba(255,255,255,0.2);
              color: #fff;
              outline: none;
            }
            .chat-input::placeholder { color: rgba(255,255,255,0.6); }
            .send-btn {
              padding: 12px 24px;
              background: #8b5cf6;
              border: none;
              border-radius: 25px;
              color: #fff;
              cursor: pointer;
              font-weight: bold;
            }
            .send-btn:hover { background: #7c3aed; }
            .controls {
              padding: 15px 20px;
              background: rgba(255,255,255,0.1);
              display: flex;
              gap: 10px;
              justify-content: center;
            }
            .control-btn {
              padding: 10px 20px;
              background: rgba(255,255,255,0.2);
              border: none;
              border-radius: 8px;
              color: #fff;
              cursor: pointer;
              font-weight: bold;
            }
            .control-btn:hover { background: rgba(255,255,255,0.3); }
            .control-btn.active { background: #22c55e; }
            @media (max-width: 768px) {
              .container { grid-template-columns: 1fr; grid-template-rows: 2fr 1fr; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="video-section">
              <div class="video-header">
                <div class="platform-info">
                  <span>${platform.logo}</span>
                  <span>${platform.name}</span>
                  <span style="background: #ef4444; padding: 4px 8px; border-radius: 12px; font-size: 12px;">● LIVE</span>
                </div>
                <div class="stream-stats">
                  <span>👥 ${platform.viewers.toLocaleString()}</span>
                  <span>💬 ${platform.chatMessages}</span>
                  <span>❤️ ${platform.followers.toLocaleString()}</span>
                </div>
              </div>
              <div class="video-content">
                📹 Live Stream Feed - ${platform.name}
              </div>
              <div class="controls">
                <button class="control-btn active" onclick="toggleMute()">🎤 Mic</button>
                <button class="control-btn active" onclick="toggleCamera()">📹 Camera</button>
                <button class="control-btn" onclick="toggleScreen()">🖥️ Screen</button>
                <button class="control-btn" onclick="toggleRecord()">⏺️ Record</button>
              </div>
            </div>
            
            <div class="chat-section">
              <div class="chat-header">
                <span>💬 Live Chat</span>
                <span style="font-size: 12px; color: rgba(255,255,255,0.7);">${platform.chatMessages} messages</span>
              </div>
              <div class="chat-messages" id="chat-messages">
                <div class="chat-message"><strong>StreamBot:</strong> Welcome to ${platform.name} stream! 🎉</div>
                <div class="chat-message"><strong>Viewer123:</strong> Great stream today!</div>
                <div class="chat-message"><strong>ProGamer:</strong> Love the setup! 💜</div>
              </div>
              <div class="chat-input-area">
                <input type="text" class="chat-input" placeholder="Type a message..." id="chat-input" maxlength="500">
                <button class="send-btn" onclick="sendMessage()">Send</button>
              </div>
            </div>
          </div>
          
          <script>
            let micMuted = false;
            let cameraOff = false;
            let screenSharing = false;
            let recording = false;
            
            function toggleMute() {
              micMuted = !micMuted;
              const btn = event.target;
              btn.textContent = micMuted ? '🔇 Mic' : '🎤 Mic';
              btn.className = micMuted ? 'control-btn' : 'control-btn active';
            }
            
            function toggleCamera() {
              cameraOff = !cameraOff;
              const btn = event.target;
              btn.textContent = cameraOff ? '📹 Camera' : '📹 Camera';
              btn.className = cameraOff ? 'control-btn' : 'control-btn active';
            }
            
            function toggleScreen() {
              screenSharing = !screenSharing;
              const btn = event.target;
              btn.textContent = screenSharing ? '🖥️ Stop Share' : '🖥️ Screen';
              btn.className = screenSharing ? 'control-btn active' : 'control-btn';
            }
            
            function toggleRecord() {
              recording = !recording;
              const btn = event.target;
              btn.textContent = recording ? '⏹️ Stop Rec' : '⏺️ Record';
              btn.className = recording ? 'control-btn active' : 'control-btn';
            }
            
            function sendMessage() {
              const input = document.getElementById('chat-input');
              const message = input.value.trim();
              if (message) {
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                messageDiv.innerHTML = '<strong>You:</strong> ' + message;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                input.value = '';
              }
            }
            
            document.getElementById('chat-input').addEventListener('keypress', function(e) {
              if (e.key === 'Enter') sendMessage();
            });
            
            // Simulate live chat messages
            setInterval(() => {
              const messages = [
                'Amazing stream! 🔥',
                'Keep it up! 💪',
                'Love this content!',
                'First time here, great stuff!',
                'When is the next stream?',
                'This is so cool! 😍'
              ];
              const usernames = ['ChatUser', 'StreamFan', 'Viewer' + Math.floor(Math.random() * 1000), 'ProWatcher'];
              
              if (Math.random() < 0.3) {
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                const username = usernames[Math.floor(Math.random() * usernames.length)];
                const message = messages[Math.floor(Math.random() * messages.length)];
                messageDiv.innerHTML = '<strong>' + username + ':</strong> ' + message;
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                if (chatMessages.children.length > 50) {
                  chatMessages.removeChild(chatMessages.firstChild);
                }
              }
            }, 3000);
          </script>
        </body>
        </html>
      `)

      popup.document.close()
      popup.focus()
    }
  }

  return (
    <div className="space-y-6">
      {/* Live Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Viewers</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => (p.isActive ? sum + p.viewers : sum), 0).toLocaleString()}
                </p>
              </div>
              <Eye className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Active Chats</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => (p.isActive ? sum + p.chatMessages : sum), 0)}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-pink-600 to-rose-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Followers</p>
                <p className="text-2xl font-bold">
                  {platforms.reduce((sum, p) => sum + p.followers, 0).toLocaleString()}
                </p>
              </div>
              <Heart className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-600 to-orange-600 text-white border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Donations</p>
                <p className="text-2xl font-bold">
                  ${platforms.reduce((sum, p) => (p.isActive ? sum + p.donations : sum), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{platform.logo}</span>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <CardDescription className="text-slate-300">
                      Key {platform.activeKeyIndex + 1}/5 Active
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={platform.isActive} onCheckedChange={() => togglePlatform(platform.id)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{platform.viewers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>{platform.chatMessages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{platform.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>${platform.donations.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-300">Stream Keys:</div>
                <select
                  className="w-full p-2 bg-white/20 border border-white/30 rounded text-white text-sm"
                  value={platform.activeKeyIndex}
                  onChange={(e) => {
                    const newIndex = Number.parseInt(e.target.value)
                    setPlatforms((prev) =>
                      prev.map((p) => (p.id === platform.id ? { ...p, activeKeyIndex: newIndex } : p)),
                    )
                  }}
                >
                  {platform.streamKeys.map((key, index) => (
                    <option key={index} value={index} className="bg-slate-800">
                      Key {index + 1}: {key.substring(0, 15)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => popOutStream(platform)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={!platform.isActive}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Pop Out
                </Button>
                <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                  <TrendingUp className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
