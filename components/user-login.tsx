"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface UserLoginProps {
  onLoginSuccess: (isAdmin: boolean) => void
  onLoginFail: () => void
}

export function UserLogin({ onLoginSuccess, onLoginFail }: UserLoginProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState("user")

  // This is a simple authentication check - in a real app, this would be done server-side
  const validateCredentials = (user: string, pass: string) => {
    // Special case for appel420
    if (user.toLowerCase() === "appel420" && pass === "All4you2enj0y") {
      return { valid: true, isAdmin: true }
    }

    // Regular users - simple validation for demo
    if (user.length > 2 && pass.length > 3) {
      return { valid: true, isAdmin: false }
    }

    return { valid: false, isAdmin: false }
  }

  const handleLogin = () => {
    setIsLoading(true)
    setError("")

    // Simulate network request
    setTimeout(() => {
      const result = validateCredentials(username, password)

      if (result.valid) {
        // Store access in session storage
        sessionStorage.setItem("userAccess", "true")
        sessionStorage.setItem("username", username)

        if (result.isAdmin) {
          sessionStorage.setItem("adminAccess", "true")
          sessionStorage.setItem("viewMode", viewMode)
        }

        onLoginSuccess(result.isAdmin)
      } else {
        setError("Invalid credentials. Please try again.")
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
          Account Login
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
            placeholder="Enter your username"
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
              placeholder="Enter your password"
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

        {/* Special view mode toggle - only visible when username is appel420 */}
        {username.toLowerCase() === "appel420" && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-800">
            <div className="text-sm text-gray-400">View as regular user</div>
            <Switch
              checked={viewMode === "user"}
              onCheckedChange={(checked) => setViewMode(checked ? "user" : "admin")}
            />
          </div>
        )}

        <Button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Authenticating..." : "Login"}
        </Button>
      </CardContent>
    </Card>
  )
}
