"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"

interface DevLoginProps {
  onLoginSuccess: () => void
  onLoginFail: () => void
}

export function DevLogin({ onLoginSuccess, onLoginFail }: DevLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // This is a simple authentication check - in a real app, this would be done server-side
  // The hash is for "All4you2enj0y" - in a real app, never store passwords in client code
  const validateCredentials = (user: string, pass: string) => {
    // Only allow appel420 to access developer settings
    if (user.toLowerCase() === "appel420") {
      // Simple hash check - this is not secure but simulates authentication
      // In a real app, this would be a server request with proper auth
      return pass === "All4you2enj0y"
    }
    return false
  }

  const handleLogin = () => {
    setIsLoading(true)
    setError("")

    // Simulate network request
    setTimeout(() => {
      if (validateCredentials(username, password)) {
        // Store dev access in session storage
        sessionStorage.setItem("devAccess", "true")
        sessionStorage.setItem("devUser", username)
        onLoginSuccess()
      } else {
        setError("Invalid credentials. Developer access denied.")
        onLoginFail()
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900 border-gray-700">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white flex items-center justify-center gap-2">
          <Lock className="h-6 w-6 text-purple-400" />
          Developer Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300" htmlFor="username">
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter developer username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter developer password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Access Developer Controls"}
        </Button>
      </CardContent>
    </Card>
  )
}
