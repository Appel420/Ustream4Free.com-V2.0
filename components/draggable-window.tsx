"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface DraggableWindowProps {
  title: string
  defaultPosition: { x: number; y: number }
  defaultSize: { width: number; height: number }
  platform: {
    id: string
    name: string
    logo: string
    viewers: number
    chatMessages: number
    audioSettings?: {
      micEnabled: boolean
      micVolume: number
      outputEnabled: boolean
      outputVolume: number
    }
    videoSettings?: {
      webcamEnabled: boolean
      webcamQuality: string
      streamQuality: string
      bitrate: number
      fps: number
    }
  }
  type: "chat" | "video" | "combined"
  onAudioSettingsChange?: (platformId: string, settings: any) => void
  onVideoSettingsChange?: (platformId: string, settings: any) => void
}

export function DraggableWindow({
  title,
  defaultPosition,
  defaultSize,
  platform,
  type: initialType,
  onAudioSettingsChange,
  onVideoSettingsChange,
}: DraggableWindowProps) {
  const [isOpen, setIsOpen] = useState(false)

  const openPopupWindow = () => {
    const width = 1000
    const height = 700
    const left = Math.max(0, (screen.width - width) / 2)
    const top = Math.max(0, (screen.height - height) / 2)

    const popup = window.open(
      "",
      `${platform.id}-stream-window`,
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=no,menubar=no,toolbar=no,location=no,status=no`,
    )

    if (popup) {
      popup.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${platform.name} Stream - Ustream4Free</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
              color: #fff;
              height: 100vh;
              overflow: hidden;
              user-select: none;
            }
            
            .window-header {
              background: rgba(0,0,0,0.9);
              padding: 8px 12px;
              border-bottom: 1px solid #333;
              display: flex;
              justify-content: space-between;
              align-items: center;
              cursor: move;
              position: relative;
            }
            
            .window-header:active {
              cursor: grabbing;
            }
            
            .window-controls {
              display: flex;
              gap: 6px;
            }
            
            .control-btn {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .control-btn.close { background: #ff5f57; }
            .control-btn.minimize { background: #ffbd2e; }
            .control-btn.maximize { background: #28ca42; }
            .control-btn:hover { transform: scale(1.1); }
            
            .platform-info {
              display: flex;
              align-items: center;
              gap: 8px;
              flex: 1;
              justify-content: center;
            }
            
            .logo { font-size: 16px; }
            .platform-name { font-size: 14px; font-weight: bold; }
            .live-badge {
              background: #ef4444;
              padding: 2px 6px;
              border-radius: 10px;
              font-size: 9px;
              font-weight: bold;
              animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.7; }
            }
            
            .container {
              display: grid;
              grid-template-columns: 2fr 1fr;
              height: calc(100vh - 40px);
              gap: 1px;
              background: #333;
              position: relative;
            }
            
            .video-section {
              background: #000;
              display: flex;
              flex-direction: column;
              position: relative;
            }
            
            .video-content {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
              position: relative;
            }
            
            .video-overlay {
              position: absolute;
              bottom: 15px;
              left: 15px;
              right: 15px;
              background: rgba(0,0,0,0.8);
              padding: 12px;
              border-radius: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .controls {
              display: flex;
              gap: 8px;
            }
            
            .control-button {
              padding: 6px 12px;
              background: #6366f1;
              border: none;
              border-radius: 4px;
              color: #fff;
              cursor: pointer;
              font-size: 11px;
              transition: all 0.2s;
            }
            
            .control-button:hover { background: #4f46e5; }
            .control-button.active { background: #22c55e; }
            
            .quality-controls {
              position: absolute;
              top: 15px;
              left: 15px;
              background: rgba(0,0,0,0.8);
              padding: 8px;
              border-radius: 6px;
              border: 1px solid #8b5cf6;
            }
            
            .volume-controls {
              position: absolute;
              top: 15px;
              right: 15px;
              background: rgba(0,0,0,0.8);
              padding: 8px;
              border-radius: 6px;
              border: 1px solid #8b5cf6;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            .position-display {
              position: absolute;
              top: 70px;
              left: 15px;
              background: rgba(0,0,0,0.8);
              padding: 6px 8px;
              border-radius: 4px;
              font-size: 10px;
              color: #8b5cf6;
              border: 1px solid #8b5cf6;
            }
            
            .chat-section {
              background: #1a1a1a;
              display: flex;
              flex-direction: column;
            }
            
            .chat-header {
              padding: 12px 16px;
              border-bottom: 1px solid #333;
              font-weight: bold;
              background: #8b5cf6;
              font-size: 14px;
            }
            
            .chat-messages {
              flex: 1;
              padding: 12px;
              overflow-y: auto;
              min-height: 0;
            }
            
            .chat-message {
              margin-bottom: 8px;
              padding: 8px 12px;
              background: rgba(139, 92, 246, 0.1);
              border-radius: 6px;
              font-size: 13px;
              line-height: 1.3;
              border-left: 2px solid #8b5cf6;
            }
            
            .chat-input-area {
              padding: 12px 16px;
              border-top: 1px solid #333;
              display: flex;
              gap: 8px;
            }
            
            .chat-input {
              flex: 1;
              padding: 8px 12px;
              border: 1px solid #333;
              border-radius: 20px;
              background: rgba(255,255,255,0.1);
              color: #fff;
              outline: none;
              font-size: 13px;
            }
            
            .send-btn {
              padding: 8px 16px;
              background: #8b5cf6;
              border: none;
              border-radius: 20px;
              color: #fff;
              cursor: pointer;
              font-weight: bold;
              font-size: 13px;
            }
            
            .send-btn:hover { background: #7c3aed; }
            
            .resize-handle {
              position: absolute;
              background: transparent;
            }
            
            .resize-handle.se {
              bottom: 0;
              right: 0;
              width: 15px;
              height: 15px;
              cursor: se-resize;
              background: linear-gradient(-45deg, transparent 40%, #8b5cf6 40%, #8b5cf6 60%, transparent 60%);
            }
            
            .resize-handle.s {
              bottom: 0;
              left: 15px;
              right: 15px;
              height: 4px;
              cursor: s-resize;
            }
            
            .resize-handle.e {
              right: 0;
              top: 15px;
              bottom: 15px;
              width: 4px;
              cursor: e-resize;
            }
            
            .resize-handle.sw {
              bottom: 0;
              left: 0;
              width: 15px;
              height: 15px;
              cursor: sw-resize;
              background: linear-gradient(45deg, transparent 40%, #8b5cf6 40%, #8b5cf6 60%, transparent 60%);
            }
            
            .resize-handle.w {
              left: 0;
              top: 15px;
              bottom: 15px;
              width: 4px;
              cursor: w-resize;
            }
            
            .resize-handle.nw {
              top: 0;
              left: 0;
              width: 15px;
              height: 15px;
              cursor: nw-resize;
              background: linear-gradient(135deg, transparent 40%, #8b5cf6 40%, #8b5cf6 60%, transparent 60%);
            }
            
            .resize-handle.n {
              top: 0;
              left: 15px;
              right: 15px;
              height: 4px;
              cursor: n-resize;
            }
            
            .resize-handle.ne {
              top: 0;
              right: 0;
              width: 15px;
              height: 15px;
              cursor: ne-resize;
              background: linear-gradient(-135deg, transparent 40%, #8b5cf6 40%, #8b5cf6 60%, transparent 60%);
            }
            
            .quality-select {
              background: #1a1a1a;
              border: 1px solid #8b5cf6;
              color: #fff;
              padding: 4px 8px;
              border-radius: 3px;
              font-size: 11px;
            }
            
            .volume-slider {
              width: 80px;
            }
          </style>
        </head>
        <body>
          <div class="window-header" id="window-header">
            <div class="window-controls">
              <div class="control-btn close" onclick="window.close()"></div>
              <div class="control-btn minimize" onclick="minimizeWindow()"></div>
              <div class="control-btn maximize" onclick="toggleMaximize()"></div>
            </div>
            <div class="platform-info">
              <span class="logo">${platform.logo}</span>
              <span class="platform-name">${platform.name}</span>
              <span class="live-badge">● LIVE</span>
            </div>
            <div style="width: 60px;"></div>
          </div>
          
          <div class="container">
            <div class="video-section">
              <div class="video-content">
                <div class="quality-controls">
                  <div style="margin-bottom: 4px; font-size: 10px; color: #8b5cf6;">Quality:</div>
                  <select class="quality-select" id="quality-select">
                    <option value="720p30">720p @ 30fps</option>
                    <option value="1080p30" selected>1080p @ 30fps</option>
                    <option value="1080p60">1080p @ 60fps</option>
                    <option value="1440p30">1440p @ 30fps</option>
                    <option value="4k30">4K @ 30fps</option>
                  </select>
                </div>
                
                <div class="volume-controls">
                  <span style="font-size: 10px; color: #8b5cf6;">Vol:</span>
                  <input type="range" class="volume-slider" min="0" max="100" value="80" id="volume-slider">
                  <span id="volume-display" style="font-size: 10px; color: #fff;">80%</span>
                </div>
                
                <div class="position-display" id="position-display">
                  Position: <span id="pos-x">0</span>, <span id="pos-y">0</span><br>
                  Size: <span id="size-w">${width}</span> × <span id="size-h">${height}</span>
                </div>
                
                <div style="text-center;">
                  <div style="font-size: 40px; margin-bottom: 8px;">${platform.logo}</div>
                  <div style="font-size: 20px; margin-bottom: 8px;">${platform.name}</div>
                  <div style="font-size: 14px; color: #8b5cf6;">Live Stream Active</div>
                  <div style="font-size: 12px; color: #888; margin-top: 8px;">
                    ${platform.videoSettings?.streamQuality || "1080p30"} • ${platform.videoSettings?.bitrate || 4500} kbps
                  </div>
                </div>
                
                <div class="video-overlay">
                  <div>
                    <div style="font-size: 12px; margin-bottom: 4px;">Webcam: ${platform.videoSettings?.webcamQuality || "1080p30"}</div>
                    <div style="font-size: 10px; color: #888;">Uptime: ${Math.floor(Math.random() * 120 + 30)} min</div>
                  </div>
                  <div class="controls">
                    <button class="control-button ${platform.audioSettings?.micEnabled ? "active" : ""}" onclick="toggleMic()">🎤 Mic</button>
                    <button class="control-button ${platform.videoSettings?.webcamEnabled ? "active" : ""}" onclick="toggleCam()">📹 Cam</button>
                    <button class="control-button" onclick="toggleScreen()">🖥️ Screen</button>
                    <button class="control-button" onclick="toggleRecord()">⏺️ Record</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="chat-section">
              <div class="chat-header">💬 Live Chat</div>
              <div class="chat-messages" id="chat-messages">
                <div class="chat-message">
                  <strong>StreamBot:</strong> Welcome to ${platform.name}! 🎉
                </div>
                <div class="chat-message">
                  <strong>Viewer123:</strong> Amazing quality! 🔥
                </div>
                <div class="chat-message">
                  <strong>ProStreamer:</strong> Love the stream!
                </div>
              </div>
              <div class="chat-input-area">
                <input type="text" class="chat-input" placeholder="Type a message..." id="chat-input" maxlength="500">
                <button class="send-btn" onclick="sendMessage()">Send</button>
              </div>
            </div>
            
            <!-- Resize handles -->
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
            
            // Window dragging
            const header = document.getElementById('window-header');
            
            header.addEventListener('mousedown', (e) => {
              if (e.target.classList.contains('control-btn')) return;
              isDragging = true;
              dragStartX = e.clientX - window.screenX;
              dragStartY = e.clientY - window.screenY;
              document.body.style.cursor = 'grabbing';
            });
            
            document.addEventListener('mousemove', (e) => {
              if (isDragging && !isMaximized) {
                const newX = Math.max(0, Math.min(screen.width - window.outerWidth, e.screenX - dragStartX));
                const newY = Math.max(0, Math.min(screen.height - window.outerHeight, e.screenY - dragStartY));
                window.moveTo(newX, newY);
                updatePositionDisplay();
              } else if (isResizing) {
                handleResize(e);
              }
            });
            
            document.addEventListener('mouseup', () => {
              isDragging = false;
              isResizing = false;
              resizeDirection = '';
              document.body.style.cursor = 'default';
            });
            
            // Window resizing
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
              
              // Constraints
              newWidth = Math.max(400, Math.min(screen.width, newWidth));
              newHeight = Math.max(300, Math.min(screen.height, newHeight));
              newX = Math.max(0, Math.min(screen.width - newWidth, newX));
              newY = Math.max(0, Math.min(screen.height - newHeight, newY));
              
              window.moveTo(newX, newY);
              window.resizeTo(newWidth, newHeight);
              updatePositionDisplay();
            }
            
            function updatePositionDisplay() {
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
              updatePositionDisplay();
            }
            
            function toggleMic() {
              const btn = document.querySelector('.control-button');
              btn.classList.toggle('active');
            }
            
            function toggleCam() {
              const btns = document.querySelectorAll('.control-button');
              btns[1].classList.toggle('active');
            }
            
            function toggleScreen() {
              const btns = document.querySelectorAll('.control-button');
              btns[2].classList.toggle('active');
            }
            
            function toggleRecord() {
              const btns = document.querySelectorAll('.control-button');
              btns[3].classList.toggle('active');
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
            
            document.getElementById('volume-slider').addEventListener('input', function(e) {
              document.getElementById('volume-display').textContent = e.target.value + '%';
            });
            
            // Initialize
            updatePositionDisplay();
            
            // Simulate chat messages
            setInterval(() => {
              if (Math.random() < 0.3) {
                const messages = ['Great stream!', 'Love it!', 'Amazing quality!', 'Keep it up!'];
                const users = ['Viewer' + Math.floor(Math.random() * 1000), 'StreamFan', 'ChatUser'];
                
                const chatMessages = document.getElementById('chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message';
                messageDiv.innerHTML = '<strong>' + users[Math.floor(Math.random() * users.length)] + ':</strong> ' + messages[Math.floor(Math.random() * messages.length)];
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
      setIsOpen(true)
    }
  }

  return (
    <Button
      size="sm"
      onClick={openPopupWindow}
      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
    >
      <ExternalLink className="h-3 w-3 mr-1" />
      Open
    </Button>
  )
}
