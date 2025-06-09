"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Server,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Database,
  Network,
  Cpu,
  HardDrive,
  Activity,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react"

interface SystemHealth {
  cpu: number
  memory: number
  storage: number
  network: number
  uptime: string
  lastUpdate: Date
}

interface SecurityStatus {
  apiKeysSecured: boolean
  encryptionActive: boolean
  firewallStatus: boolean
  lastSecurityScan: Date
  vulnerabilities: number
}

interface AITask {
  id: string
  name: string
  status: "running" | "completed" | "failed" | "pending"
  progress: number
  description: string
  lastRun: Date
}

export function AIBackendManager() {
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 62,
    storage: 78,
    network: 89,
    uptime: "7d 14h 32m",
    lastUpdate: new Date(),
  })

  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    apiKeysSecured: true,
    encryptionActive: true,
    firewallStatus: true,
    lastSecurityScan: new Date(),
    vulnerabilities: 0,
  })

  const [aiTasks, setAiTasks] = useState<AITask[]>([
    {
      id: "api-monitor",
      name: "API Monitoring",
      status: "running",
      progress: 100,
      description: "Monitoring all platform APIs for availability and performance",
      lastRun: new Date(),
    },
    {
      id: "security-scan",
      name: "Security Scanning",
      status: "completed",
      progress: 100,
      description: "Scanning for vulnerabilities and security threats",
      lastRun: new Date(Date.now() - 3600000),
    },
    {
      id: "performance-optimization",
      name: "Performance Optimization",
      status: "running",
      progress: 67,
      description: "Optimizing stream quality and reducing latency",
      lastRun: new Date(),
    },
    {
      id: "credential-rotation",
      name: "Credential Rotation",
      status: "pending",
      progress: 0,
      description: "Rotating API keys and access tokens for security",
      lastRun: new Date(Date.now() - 86400000),
    },
    {
      id: "backup-sync",
      name: "Backup Synchronization",
      status: "completed",
      progress: 100,
      description: "Synchronizing configuration backups to secure storage",
      lastRun: new Date(Date.now() - 1800000),
    },
  ])

  const [isManualOverride, setIsManualOverride] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update system health
      setSystemHealth((prev) => ({
        ...prev,
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(95, prev.memory + (Math.random() - 0.5) * 5)),
        network: Math.max(50, Math.min(100, prev.network + (Math.random() - 0.5) * 3)),
        lastUpdate: new Date(),
      }))

      // Update AI tasks
      setAiTasks((prev) =>
        prev.map((task) => {
          if (task.status === "running" && task.progress < 100) {
            return {
              ...task,
              progress: Math.min(100, task.progress + Math.random() * 5),
            }
          }
          return task
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const runTask = (taskId: string) => {
    setAiTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: "running",
              progress: 0,
              lastRun: new Date(),
            }
          : task,
      ),
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />
      case "pending":
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getHealthColor = (value: number) => {
    if (value < 50) return "text-green-400"
    if (value < 80) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-400" />
          AI Backend Manager
        </h2>
        <div className="flex items-center gap-2">
          <Badge variant={isManualOverride ? "destructive" : "default"}>
            {isManualOverride ? "Manual Override" : "AI Managed"}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="text-white border-gray-600"
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-blue-400" />
                <span className="text-white font-medium">CPU</span>
              </div>
              <span className={`font-bold ${getHealthColor(systemHealth.cpu)}`}>{systemHealth.cpu}%</span>
            </div>
            <Progress value={systemHealth.cpu} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-green-400" />
                <span className="text-white font-medium">Memory</span>
              </div>
              <span className={`font-bold ${getHealthColor(systemHealth.memory)}`}>{systemHealth.memory}%</span>
            </div>
            <Progress value={systemHealth.memory} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-400" />
                <span className="text-white font-medium">Storage</span>
              </div>
              <span className={`font-bold ${getHealthColor(systemHealth.storage)}`}>{systemHealth.storage}%</span>
            </div>
            <Progress value={systemHealth.storage} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="h-5 w-5 text-orange-400" />
                <span className="text-white font-medium">Network</span>
              </div>
              <span className={`font-bold ${getHealthColor(100 - systemHealth.network)}`}>{systemHealth.network}%</span>
            </div>
            <Progress value={systemHealth.network} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-400" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-green-400" />
                <span className="text-white">API Keys Secured</span>
              </div>
              {securityStatus.apiKeysSecured ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-400" />
                <span className="text-white">Encryption Active</span>
              </div>
              {securityStatus.encryptionActive ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-400" />
                <span className="text-white">Firewall Status</span>
              </div>
              {securityStatus.firewallStatus ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Last Security Scan: {securityStatus.lastSecurityScan.toLocaleString()}</span>
            <Badge variant={securityStatus.vulnerabilities === 0 ? "default" : "destructive"}>
              {securityStatus.vulnerabilities} Vulnerabilities
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Tasks */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Automated Tasks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {aiTasks.map((task) => (
            <div key={task.id} className="p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <span className="text-white font-medium">{task.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {task.status}
                  </Badge>
                  {task.status === "pending" && (
                    <Button size="sm" onClick={() => runTask(task.id)} className="bg-blue-600 hover:bg-blue-700">
                      Run
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-2">{task.description}</p>

              {task.status === "running" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Progress</span>
                    <span>{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              )}

              <div className="text-xs text-gray-500 mt-2">Last run: {task.lastRun.toLocaleString()}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-blue-400" />
            System Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Uptime:</span>
                <span className="text-white">{systemHealth.uptime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Update:</span>
                <span className="text-white">{systemHealth.lastUpdate.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">AI Status:</span>
                <Badge variant="default" className="bg-green-600">
                  Active
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Backend Version:</span>
                <span className="text-white">v2.1.4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">API Endpoints:</span>
                <span className="text-white">
                  {showSensitiveData ? "https://api.ustream4free.com" : "••••••••••••••••••••"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Database:</span>
                <Badge variant="default" className="bg-blue-600">
                  Connected
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
