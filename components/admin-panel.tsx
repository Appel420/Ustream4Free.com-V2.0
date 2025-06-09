"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Database,
  Server,
  Settings,
  Terminal,
  Shield,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Lock,
  Cpu,
  Network,
  FileCode,
  Wrench,
  Eye,
  EyeOff,
} from "lucide-react"

interface AdminPanelProps {
  onLogout: () => void
  onToggleViewMode: () => void
  viewMode: string
}

export function AdminPanel({ onLogout, onToggleViewMode, viewMode }: AdminPanelProps) {
  const [username, setUsername] = useState("")
  const [systemStatus, setSystemStatus] = useState({
    cpu: 32,
    memory: 48,
    network: 78,
    storage: 65,
  })
  const [apiKeys, setApiKeys] = useState({
    twitch: "sk_live_twitch_*************KTRW",
    youtube: "AIza*************************mHg",
    facebook: "EAAd************************rZD",
    tiktok: "tt.************************.aBc",
  })
  const [debugMode, setDebugMode] = useState(false)
  const [loggingLevel, setLoggingLevel] = useState([2]) // 0-4: off, error, warn, info, debug
  const [serverEndpoint, setServerEndpoint] = useState("https://api.ustream4free.com/v1")
  const [isTestingApi, setIsTestingApi] = useState(false)
  const [apiStatus, setApiStatus] = useState<"success" | "error" | "pending" | null>(null)

  useEffect(() => {
    // Get username from session storage
    const storedUsername = sessionStorage.getItem("username")
    if (storedUsername) {
      setUsername(storedUsername)
    }

    // Simulate system stats updates
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 40) + 20,
        memory: Math.floor(Math.random() * 30) + 40,
        network: Math.floor(Math.random() * 20) + 70,
        storage: Math.floor(Math.random() * 10) + 60,
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const testApiConnection = () => {
    setIsTestingApi(true)
    setApiStatus("pending")

    // Simulate API test
    setTimeout(() => {
      setIsTestingApi(false)
      setApiStatus(Math.random() > 0.2 ? "success" : "error")

      // Reset status after a few seconds
      setTimeout(() => {
        setApiStatus(null)
      }, 3000)
    }, 1500)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("userAccess")
    sessionStorage.removeItem("adminAccess")
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("viewMode")
    onLogout()
  }

  return (
    <div className="space-y-6 p-6 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 border border-purple-600/40 flex items-center justify-center">
            <Shield className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Management Console</h2>
            <div className="text-sm text-gray-400">Logged in as {username}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToggleViewMode} className="flex items-center gap-1">
            {viewMode === "admin" ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">View as User</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Admin View</span>
              </>
            )}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Status */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-400" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-gray-300">CPU Usage</span>
                </div>
                <span className="text-sm text-gray-300">{systemStatus.cpu}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${systemStatus.cpu}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-gray-300">Memory Usage</span>
                </div>
                <span className="text-sm text-gray-300">{systemStatus.memory}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${systemStatus.memory}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-gray-300">Network</span>
                </div>
                <span className="text-sm text-gray-300">{systemStatus.network}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${systemStatus.network}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">Storage</span>
                </div>
                <span className="text-sm text-gray-300">{systemStatus.storage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${systemStatus.storage}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-red-400" />
              API Keys
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(apiKeys).map(([platform, key]) => (
                <div key={platform} className="space-y-1">
                  <label className="text-sm font-medium text-gray-300 capitalize">{platform} API Key</label>
                  <div className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => setApiKeys({ ...apiKeys, [platform]: e.target.value })}
                      className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
                    />
                    <Button size="sm" variant="outline" className="shrink-0">
                      Rotate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Debug Settings */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-green-400" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Advanced Logging</div>
                <div className="text-xs text-gray-400">Enable detailed error messages and logging</div>
              </div>
              <Switch checked={debugMode} onCheckedChange={setDebugMode} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-white">Logging Level</div>
                <div className="text-xs text-gray-400">
                  {loggingLevel[0] === 0
                    ? "Off"
                    : loggingLevel[0] === 1
                      ? "Error"
                      : loggingLevel[0] === 2
                        ? "Warning"
                        : loggingLevel[0] === 3
                          ? "Info"
                          : "Debug"}
                </div>
              </div>
              <Slider
                value={loggingLevel}
                onValueChange={setLoggingLevel}
                min={0}
                max={4}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Off</span>
                <span>Error</span>
                <span>Warn</span>
                <span>Info</span>
                <span>Debug</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Server Endpoint</label>
              <Input
                value={serverEndpoint}
                onChange={(e) => setServerEndpoint(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white font-mono text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={testApiConnection}
                disabled={isTestingApi}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isTestingApi ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Network className="h-4 w-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>

              {apiStatus === "success" && (
                <Badge className="bg-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" /> Connected
                </Badge>
              )}

              {apiStatus === "error" && (
                <Badge className="bg-red-600">
                  <XCircle className="h-3 w-3 mr-1" /> Failed
                </Badge>
              )}

              {apiStatus === "pending" && (
                <Badge className="bg-yellow-600">
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Testing
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Tools */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-yellow-400" />
              Advanced Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                <FileCode className="h-4 w-4 mr-2" />
                API Logs
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                <Terminal className="h-4 w-4 mr-2" />
                Console
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                <Database className="h-4 w-4 mr-2" />
                Database
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </Button>
              <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                <Settings className="h-4 w-4 mr-2" />
                Config
              </Button>
              <Button className="bg-red-900 hover:bg-red-800 text-white">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="text-sm font-medium text-white mb-1">System Info</div>
              <div className="text-xs text-gray-400">
                <p>
                  Current build: <span className="text-green-400">v0.9.4-beta</span>
                </p>
                <p>Last deployment: 2025-06-08 21:34:12 UTC</p>
                <p>Environment: production</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
