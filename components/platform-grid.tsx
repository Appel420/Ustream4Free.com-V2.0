"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Users, MessageCircle, Eye, TrendingUp, Trash2, ExternalLink } from "lucide-react"
import { InstantPlatformSelector } from "./instant-platform-selector"
import type { StreamingPlatform } from "@/lib/comprehensive-platforms"

interface Platform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl?: string
  color: string
  icon?: React.ReactNode
  viewers: number
  isLive: boolean
  chatMessages: number
  streamKey: string
  oauth: {
    clientId: string
    authUrl: string
    tokenUrl: string
    scopes: string[]
    redirectUri: string
  }
  api: {
    baseUrl: string
    streamEndpoint: string
    chatEndpoint?: string
  }
  features: {
    liveStreaming: boolean
    chat: boolean
    analytics: boolean
    multistream: boolean
  }
  limits: {
    maxBitrate: number
    maxResolution: string
  }
}

interface PlatformGridProps {
  platforms: Platform[]
  setPlatforms: (platforms: Platform[]) => void
  deviceType: "desktop" | "tablet" | "mobile"
  onRemovePlatform?: (platformId: string) => void
}

export function PlatformGrid({ platforms, setPlatforms, deviceType, onRemovePlatform }: PlatformGridProps) {
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [popoutWindows, setPopoutWindows] = useState<Map<string, Window>>(new Map())

  const handlePlatformAdd = (platformConfig: StreamingPlatform) => {
    const newPlatform: Platform = {
      id: platformConfig.id,
      name: platformConfig.name,
      displayName: platformConfig.displayName,
      logo: platformConfig.logo,
      logoUrl: platformConfig.logoUrl,
      color: platformConfig.color,
      viewers: 0,
      isLive: false,
      chatMessages: 0,
      streamKey: "",
      oauth: platformConfig.oauth,
      api: platformConfig.api,
      features: platformConfig.features,
      limits: platformConfig.limits,
    }

    setPlatforms([...platforms, newPlatform])
    setShowPlatformSelector(false)
  }

  const togglePlatform = (platformId: string) => {
    setPlatforms(platforms.map((p) => (p.id === platformId ? { ...p, isLive: !p.isLive } : p)))
  }

  const popOutPlatform = (platform: Platform) => {
    const existingPopup = popoutWindows.get(platform.id)
    if (existingPopup && !existingPopup.closed) {
      existingPopup.focus()
      return
    }

    const width = deviceType === "mobile" ? window.innerWidth : 1200
    const height = deviceType === "mobile" ? window.innerHeight : 800
    const left = deviceType === "mobile" ? 0 : Math.max(0, (screen.width - width) / 2)
    const top = deviceType === "mobile" ? 0 : Math.max(0, (screen.height - height) / 2)

    const popup = window.open(
      "",
      `${platform.id}-ustream4free`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,menubar=no,toolbar=no,location=no,status=no`,
    )

    if (popup) {
      setPopoutWindows((prev) => new Map(prev.set(platform.id, popup)))

      popup.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${platform.displayName} Stream - Ustream4Free.com</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #fff;
            height: 100vh;
            overflow: hidden;
            cursor: default;
          }
          .drag-header {
            background: linear-gradient(135deg, ${platform.color}20 0%, rgba(0,0,0,0.9) 100%);
            padding: 12px 20px;
            border-bottom: 2px solid ${platform.color}40;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            position: relative;
            backdrop-filter: blur(10px);
          }
          .drag-header:active { cursor: grabbing; }
          .window-controls {
            display: flex;
            gap: 8px;
            align-items: center;
          }
          .control-dot {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s;
            border: 1px solid rgba(255,255,255,0.2);
          }
          .control-dot.close { background: #ff5f57; }
          .control-dot.minimize { background: #ffbd2e; }
          .control-dot.maximize { background: #28ca42; }
          .control-dot:hover { transform: scale(1.2); box-shadow: 0 0 10px currentColor; }
          .platform-info {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
            justify-content: center;
          }
          .platform-logo {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${platform.color}20;
            border: 2px solid ${platform.color}40;
          }
          .platform-name { 
            font-size: 18px; 
            font-weight: bold; 
            color: ${platform.color};
          }
          .live-badge {
            background: linear-gradient(45deg, #ef4444, #dc2626);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            animation: pulse 2s infinite;
            box-shadow: 0 0 20px #ef444440;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          .container {
            display: grid;
            grid-template-columns: 2fr 1fr;
            height: calc(100vh - 60px);
            gap: 2px;
            background: #333;
            position: relative;
          }
          .video-section {
            background: linear-gradient(135deg, #000 0%, #1a1a1a 100%);
            display: flex;
            flex-direction: column;
            position: relative;
            border: 1px solid ${platform.color}20;
          }
          .video-content {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: #666;
            position: relative;
            background: radial-gradient(circle at center, ${platform.color}10 0%, transparent 70%);
          }
          .platform-display {
            text-align: center;
            padding: 40px;
          }
          .platform-display .logo {
            font-size: 80px;
            margin-bottom: 20px;
            filter: drop-shadow(0 0 20px ${platform.color}40);
          }
          .platform-display .name {
            font-size: 32px;
            font-weight: bold;
            color: ${platform.color};
            margin-bottom: 10px;
          }
          .platform-display .status {
            font-size: 18px;
            color: #22c55e;
            margin-bottom: 20px;
          }
          .platform-display .info {
            font-size: 14px;
            color: #888;
            line-height: 1.6;
          }
          .video-overlay {
            position: absolute;
            bottom: 20px;
            left: 20px;
            right: 20px;
            background: rgba(0,0,0,0.9);
            padding: 20px;
            border-radius: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid ${platform.color}40;
            backdrop-filter: blur(10px);
          }
          .controls {
            display: flex;
            gap: 12px;
          }
          .control-btn {
            padding: 10px 20px;
            background: linear-gradient(135deg, ${platform.color} 0%, ${platform.color}80 100%);
            border: none;
            border-radius: 8px;
            color: #fff;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s;
            box-shadow: 0 4px 15px ${platform.color}40;
          }
          .control-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 25px ${platform.color}60;
          }
          .control-btn.active { 
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            box-shadow: 0 4px 15px #22c55e40;
          }
          .chat-section {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            display: flex;
            flex-direction: column;
            border: 1px solid ${platform.color}20;
          }
          .chat-header {
            padding: 20px;
            border-bottom: 2px solid ${platform.color}40;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, ${platform.color}20 0%, transparent 100%);
          }
          .chat-messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            min-height: 0;
          }
          .chat-message {
            margin-bottom: 15px;
            padding: 12px 18px;
            background: linear-gradient(135deg, ${platform.color}10 0%, rgba(255,255,255,0.05) 100%);
            border-radius: 12px;
            font-size: 14px;
            line-height: 1.5;
            border-left: 3px solid ${platform.color};
            transition: all 0.2s;
          }
          .chat-message:hover {
            background: linear-gradient(135deg, ${platform.color}20 0%, rgba(255,255,255,0.1) 100%);
            transform: translateX(5px);
          }
          .chat-input-area {
            padding: 20px;
            border-top: 2px solid ${platform.color}40;
            display: flex;
            gap: 12px;
            background: linear-gradient(135deg, ${platform.color}10 0%, transparent 100%);
          }
          .chat-input {
            flex: 1;
            padding: 15px 20px;
            border: 2px solid ${platform.color}40;
            border-radius: 25px;
            background: rgba(0,0,0,0.5);
            color: #fff;
            outline: none;
            font-size: 14px;
            transition: all 0.3s;
          }
          .chat-input:focus {
            border-color: ${platform.color};
            box-shadow: 0 0 20px ${platform.color}40;
          }
          .chat-input::placeholder { color: rgba(255,255,255,0.5); }
          .send-btn {
            padding: 15px 30px;
            background: linear-gradient(135deg, ${platform.color} 0%, ${platform.color}80 100%);
            border: none;
            border-radius: 25px;
            color: #fff;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 15px ${platform.color}40;
          }
          .send-btn:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 6px 25px ${platform.color}60;
          }
          
          /* Resize handles - 8 directions */
          .resize-handle {
            position: absolute;
            background: transparent;
            z-index: 1000;
          }
          .resize-handle:hover {
            background: ${platform.color}40;
          }
          .resize-handle.n {
            top: 0; left: 10px; right: 10px; height: 10px;
            cursor: n-resize;
          }
          .resize-handle.ne {
            top: 0; right: 0; width: 20px; height: 20px;
            cursor: ne-resize;
            background: linear-gradient(-45deg, transparent 0%, transparent 40%, ${platform.color} 40%, ${platform.color} 60%, transparent 60%);
          }
          .resize-handle.e {
            right: 0; top: 10px; bottom: 10px; width: 10px;
            cursor: e-resize;
          }
          .resize-handle.se {
            bottom: 0; right: 0; width: 20px; height: 20px;
            cursor: se-resize;
            background: linear-gradient(45deg, transparent 0%, transparent 40%, ${platform.color} 40%, ${platform.color} 60%, transparent 60%);
          }
          .resize-handle.s {
            bottom: 0; left: 10px; right: 10px; height: 10px;
            cursor: s-resize;
          }
          .resize-handle.sw {
            bottom: 0; left: 0; width: 20px; height: 20px;
            cursor: sw-resize;
            background: linear-gradient(135deg, transparent 0%, transparent 40%, ${platform.color} 40%, ${platform.color} 60%, transparent 60%);
          }
          .resize-handle.w {
            left: 0; top: 10px; bottom: 10px; width: 10px;
            cursor: w-resize;
          }
          .resize-handle.nw {
            top: 0; left: 0; width: 20px; height: 20px;
            cursor: nw-resize;
            background: linear-gradient(-135deg, transparent 0%, transparent 40%, ${platform.color} 40%, ${platform.color} 60%, transparent 60%);
          }
          
          .position-info {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.9);
            padding: 10px 15px;
            border-radius: 10px;
            font-size: 12px;
            color: ${platform.color};
            border: 2px solid ${platform.color}40;
            backdrop-filter: blur(10px);
          }
          
          @media (max-width: 768px) {
            .container { grid-template-columns: 1fr; grid-template-rows: 2fr 1fr; }
            .drag-header { flex-direction: column; gap: 10px; text-align: center; }
          }
        </style>
      </head>
      <body>
        <div class="drag-header" id="drag-header">
          <div class="window-controls">
            <div class="control-dot close" onclick="window.close()" title="Close"></div>
            <div class="control-dot minimize" onclick="minimizeWindow()" title="Minimize"></div>
            <div class="control-dot maximize" onclick="toggleMaximize()" title="Maximize"></div>
          </div>
          <div class="platform-info">
            <div class="platform-logo">
              ${
                platform.logoUrl
                  ? `<img src="${platform.logoUrl}" alt="${platform.displayName}" style="width: 24px; height: 24px; border-radius: 4px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                 <span style="display: none; font-size: 20px;">${platform.logo}</span>`
                  : `<span style="font-size: 20px;">${platform.logo}</span>`
              }
            </div>
            <span class="platform-name">${platform.displayName}</span>
            <span class="live-badge">● LIVE</span>
            <span style="font-size: 12px; color: #888;">Ustream4Free.com</span>
          </div>
          <div style="width: 120px;"></div>
        </div>
        
        <div class="container" id="container">
          <div class="video-section">
            <div class="video-content">
              <div class="position-info" id="position-info">
                Position: <span id="pos-x">0</span>, <span id="pos-y">0</span><br>
                Size: <span id="size-w">${width}</span> × <span id="size-h">${height}</span>
              </div>
              
              <div class="platform-display">
                <div class="logo">${
                  platform.logoUrl
                    ? `<img src="${platform.logoUrl}" alt="${platform.displayName}" style="width: 80px; height: 80px; border-radius: 12px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                   <span style="display: none;">${platform.logo}</span>`
                    : platform.logo
                }</div>
                <div class="name">${platform.displayName}</div>
                <div class="status">Live Stream Active</div>
                <div class="info">
                  Max Resolution: ${platform.limits.maxResolution}<br>
                  Max Bitrate: ${platform.limits.maxBitrate} kbps<br>
                  Features: ${Object.entries(platform.features)
                    .filter(([_, enabled]) => enabled)
                    .map(([feature]) => feature)
                    .join(", ")}
                </div>
              </div>
              
              <div class="video-overlay">
                <div>
                  <div style="font-size: 16px; margin-bottom: 8px; color: ${platform.color};">${platform.displayName} Stream</div>
                  <div style="font-size: 12px; color: #888;">
                    Uptime: ${Math.floor(Math.random() * 120 + 30)} min • 
                    Viewers: ${Math.floor(Math.random() * 1000 + 100)} • 
                    Quality: ${platform.limits.maxResolution}
                  </div>
                </div>
                <div class="controls">
                  <button class="control-btn" onclick="toggleMic()">🎤 Mic</button>
                  <button class="control-btn" onclick="toggleCamera()">📹 Cam</button>
                  <button class="control-btn" onclick="toggleScreen()">🖥️ Screen</button>
                  <button class="control-btn" onclick="toggleRecord()">⏺️ Record</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chat-section">
            <div class="chat-header">
              <span>💬 Live Chat</span>
              <span style="font-size: 12px; color: #fff;" id="chat-status">Connected</span>
            </div>
            <div class="chat-messages" id="chat-messages">
              <div class="chat-message">
                <strong>StreamBot:</strong> Welcome to ${platform.displayName} on Ustream4Free! 🎉
              </div>
              <div class="chat-message">
                <strong>Viewer123:</strong> Amazing ${platform.limits.maxResolution} quality! <span style="color: ${platform.color};">🔥</span>
              </div>
              <div class="chat-message">
                <strong>ProStreamer:</strong> ${platform.limits.maxBitrate} kbps looks perfect!
              </div>
            </div>
            <div class="chat-input-area">
              <input 
                type="text" 
                class="chat-input" 
                placeholder="Type a message..." 
                id="chat-input"
                maxlength="500"
              >
              <button class="send-btn" onclick="sendMessage()">Send</button>
            </div>
          </div>
          
          <!-- 8-direction resize handles -->
          <div class="resize-handle n" data-direction="n"></div>
          <div class="resize-handle ne" data-direction="ne"></div>
          <div class="resize-handle e" data-direction="e"></div>
          <div class="resize-handle se" data-direction="se"></div>
          <div class="resize-handle s" data-direction="s"></div>
          <div class="resize-handle sw" data-direction="sw"></div>
          <div class="resize-handle w" data-direction="w"></div>
          <div class="resize-handle nw" data-direction="nw"></div>
        </div>
        
        <script>
          let isDragging = false;
          let isResizing = false;
          let dragStartX = 0;
          let dragStartY = 0;
          let resizeDirection = '';
          let isMaximized = false;
          let originalBounds = { x: 0, y: 0, width: ${width}, height: ${height} };
          
          // Window dragging functionality
          const dragHeader = document.getElementById('drag-header');
          
          dragHeader.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('control-dot') || e.target.classList.contains('resize-handle')) return;
            isDragging = true;
            dragStartX = e.clientX - window.screenX;
            dragStartY = e.clientY - window.screenY;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
          });
          
          document.addEventListener('mousemove', (e) => {
            if (isDragging && !isMaximized) {
              const newX = Math.max(0, Math.min(screen.width - window.outerWidth, e.screenX - dragStartX));
              const newY = Math.max(0, Math.min(screen.height - window.outerHeight, e.screenY - dragStartY));
              window.moveTo(newX, newY);
              updatePositionInfo();
            } else if (isResizing) {
              handleResize(e);
            }
          });
          
          document.addEventListener('mouseup', () => {
            isDragging = false;
            isResizing = false;
            resizeDirection = '';
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
          });
          
          // Window resizing functionality
          const resizeHandles = document.querySelectorAll('.resize-handle');
          resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
              e.preventDefault();
              e.stopPropagation();
              isResizing = true;
              resizeDirection = handle.dataset.direction;
              dragStartX = e.clientX;
              dragStartY = e.clientY;
              originalBounds = {
                x: window.screenX,
                y: window.screenY,
                width: window.outerWidth,
                height: window.outerHeight
              };
            });
          });
          
          function handleResize(e) {
            if (!isResizing || isMaximized) return;
            
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            let newX = originalBounds.x;
            let newY = originalBounds.y;
            let newWidth = originalBounds.width;
            let newHeight = originalBounds.height;
            
            switch (resizeDirection) {
              case 'n':
                newY = originalBounds.y + deltaY;
                newHeight = originalBounds.height - deltaY;
                break;
              case 'ne':
                newY = originalBounds.y + deltaY;
                newWidth = originalBounds.width + deltaX;
                newHeight = originalBounds.height - deltaY;
                break;
              case 'e':
                newWidth = originalBounds.width + deltaX;
                break;
              case 'se':
                newWidth = originalBounds.width + deltaX;
                newHeight = originalBounds.height + deltaY;
                break;
              case 's':
                newHeight = originalBounds.height + deltaY;
                break;
              case 'sw':
                newX = originalBounds.x + deltaX;
                newWidth = originalBounds.width - deltaX;
                newHeight = originalBounds.height + deltaY;
                break;
              case 'w':
                newX = originalBounds.x + deltaX;
                newWidth = originalBounds.width - deltaX;
                break;
              case 'nw':
                newX = originalBounds.x + deltaX;
                newY = originalBounds.y + deltaY;
                newWidth = originalBounds.width - deltaX;
                newHeight = originalBounds.height - deltaY;
                break;
            }
            
            // Minimum size constraints
            newWidth = Math.max(600, newWidth);
            newHeight = Math.max(400, newHeight);
            
            // Maximum size constraints (screen bounds)
            newWidth = Math.min(screen.width, newWidth);
            newHeight = Math.min(screen.height, newHeight);
            
            // Position constraints
            newX = Math.max(0, Math.min(screen.width - newWidth, newX));
            newY = Math.max(0, Math.min(screen.height - newHeight, newY));
            
            window.moveTo(newX, newY);
            window.resizeTo(newWidth, newHeight);
            updatePositionInfo();
          }
          
          function updatePositionInfo() {
            document.getElementById('pos-x').textContent = window.screenX;
            document.getElementById('pos-y').textContent = window.screenY;
            document.getElementById('size-w').textContent = window.outerWidth;
            document.getElementById('size-h').textContent = window.outerHeight;
          }
          
          function minimizeWindow() {
            window.blur();
          }
          
          function toggleMaximize() {
            if (!isMaximized) {
              originalBounds = {
                x: window.screenX,
                y: window.screenY,
                width: window.outerWidth,
                height: window.outerHeight
              };
              window.moveTo(0, 0);
              window.resizeTo(screen.width, screen.height);
              isMaximized = true;
            } else {
              window.moveTo(originalBounds.x, originalBounds.y);
              window.resizeTo(originalBounds.width, originalBounds.height);
              isMaximized = false;
            }
            updatePositionInfo();
          }
          
          // Control functions
          let micOn = false;
          let cameraOn = false;
          let screenSharing = false;
          let recording = false;
          
          function toggleMic() {
            micOn = !micOn;
            const btn = document.querySelector('.control-btn');
            btn.className = micOn ? 'control-btn active' : 'control-btn';
          }
          
          function toggleCamera() {
            cameraOn = !cameraOn;
            const btns = document.querySelectorAll('.control-btn');
            btns[1].className = cameraOn ? 'control-btn active' : 'control-btn';
          }
          
          function toggleScreen() {
            screenSharing = !screenSharing;
            const btns = document.querySelectorAll('.control-btn');
            btns[2].className = screenSharing ? 'control-btn active' : 'control-btn';
          }
          
          function toggleRecord() {
            recording = !recording;
            const btns = document.querySelectorAll('.control-btn');
            btns[3].className = recording ? 'control-btn active' : 'control-btn';
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
          
          // Initialize position info
          updatePositionInfo();
          
          // Simulate real-time chat
          setInterval(() => {
            if (Math.random() < 0.2) {
              const messages = [
                'Great stream quality!',
                'Love this platform!',
                'Amazing setup!',
                'Keep it up!',
                'This is awesome!'
              ];
              const users = ['StreamFan', 'Viewer123', 'TechLover', 'StreamPro'];
              
              const chatMessages = document.getElementById('chat-messages');
              const messageDiv = document.createElement('div');
              messageDiv.className = 'chat-message';
              const user = users[Math.floor(Math.random() * users.length)];
              const message = messages[Math.floor(Math.random() * messages.length)];
              messageDiv.innerHTML = '<strong>' + user + ':</strong> ' + message;
              chatMessages.appendChild(messageDiv);
              chatMessages.scrollTop = chatMessages.scrollHeight;
              
              if (chatMessages.children.length > 50) {
                chatMessages.removeChild(chatMessages.firstChild);
              }
            }
          }, 5000);
        </script>
      </body>
      </html>
    `)

      popup.document.close()
      popup.focus()
    }
  }

  const gridCols = deviceType === "mobile" ? "grid-cols-1" : deviceType === "tablet" ? "grid-cols-2" : "grid-cols-3"

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Streaming Platforms</h2>
          <p className="text-gray-400 text-sm">Click any platform to open a fully draggable stream window</p>
        </div>
        <Button
          onClick={() => setShowPlatformSelector(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Platform
        </Button>
      </div>

      <div className={`grid ${gridCols} gap-6`}>
        {platforms.map((platform) => (
          <Card
            key={platform.id}
            className="bg-gray-900/90 backdrop-blur-md border-gray-700 hover:border-gray-600 transition-all duration-200 group"
            style={{ borderColor: `${platform.color}30` }}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center border-2"
                    style={{
                      backgroundColor: `${platform.color}20`,
                      borderColor: `${platform.color}40`,
                    }}
                  >
                    {platform.logoUrl ? (
                      <img
                        src={platform.logoUrl || "/placeholder.svg"}
                        alt={platform.displayName}
                        className="w-8 h-8 rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.nextElementSibling!.style.display = "block"
                        }}
                      />
                    ) : null}
                    <span className="text-2xl" style={{ display: platform.logoUrl ? "none" : "block" }}>
                      {platform.logo}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{platform.displayName}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={platform.isLive ? "destructive" : "secondary"} className="text-xs">
                        {platform.isLive ? "🔴 LIVE" : "⚫ OFFLINE"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{ borderColor: platform.color, color: platform.color }}
                      >
                        {platform.limits.maxResolution}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={platform.isLive} onCheckedChange={() => togglePlatform(platform.id)} />
                  {onRemovePlatform && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      onClick={() => onRemovePlatform(platform.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <div>
                    <div className="text-gray-400">Viewers</div>
                    <div className="text-white font-bold">{platform.viewers.toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-400" />
                  <div>
                    <div className="text-gray-400">Messages</div>
                    <div className="text-white font-bold">{platform.chatMessages}</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <Eye className="h-4 w-4 text-purple-400" />
                  <div>
                    <div className="text-gray-400">Uptime</div>
                    <div className="text-white font-bold">{Math.floor(Math.random() * 120 + 30)}m</div>
                  </div>
                </div>
                <div className="bg-gray-800/50 p-3 rounded-lg flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-400" />
                  <div>
                    <div className="text-gray-400">Bitrate</div>
                    <div className="text-white font-bold">{platform.limits.maxBitrate}k</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => popOutPlatform(platform)}
                  className="flex-1 font-medium"
                  style={{
                    backgroundColor: platform.color,
                    color: "white",
                  }}
                  size="sm"
                >
                  🚀 Open Stream Window
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="px-3"
                  onClick={() => window.open(platform.oauth.authUrl.split("/oauth")[0], "_blank")}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showPlatformSelector && (
        <InstantPlatformSelector
          onPlatformAdd={handlePlatformAdd}
          onClose={() => setShowPlatformSelector(false)}
          addedPlatforms={platforms.map((p) => p.id)}
        />
      )}
    </>
  )
}
