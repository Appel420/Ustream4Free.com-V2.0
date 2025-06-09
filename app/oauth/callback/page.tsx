"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, AlertCircle, ExternalLink } from "lucide-react"
import { SecureOAuthManager } from "@/lib/secure-oauth"
import { OAuthService } from "@/lib/oauth-service"

interface CallbackState {
  status: "processing" | "success" | "error"
  message: string
  platform?: string
  error?: string
}

export default function OAuthCallback() {
  const [state, setState] = useState<CallbackState>({
    status: "processing",
    message: "Processing OAuth authentication...",
  })

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get("code")
        const stateParam = urlParams.get("state")
        const error = urlParams.get("error")
        const errorDescription = urlParams.get("error_description")

        if (error) {
          setState({
            status: "error",
            message: "Authentication failed",
            error: errorDescription || error,
          })

          // Send error to parent window
          window.opener?.postMessage(
            {
              type: "oauth_error",
              error: error,
              description: errorDescription,
            },
            window.location.origin,
          )
          return
        }

        if (!code || !stateParam) {
          setState({
            status: "error",
            message: "Invalid callback parameters",
            error: "Missing authorization code or state parameter",
          })

          window.opener?.postMessage(
            {
              type: "oauth_error",
              error: "invalid_request",
              description: "Missing required parameters",
            },
            window.location.origin,
          )
          return
        }

        setState({
          status: "processing",
          message: "Exchanging authorization code for access token...",
        })

        // Get the OAuth service to handle the callback
        const oauthService = OAuthService.getInstance()
        const oauthManager = SecureOAuthManager.getInstance()

        // We need to determine which platform this callback is for
        // This is a limitation of the current design - we'll need to store platform info in state
        // For now, we'll try to extract it from the state parameter or use a different approach

        // Try to handle the callback - this will require platform-specific credentials
        // Since we can't determine the platform from the callback alone, we'll send the raw data
        // to the parent window and let it handle the token exchange

        setState({
          status: "success",
          message: "Authentication successful! Completing setup...",
        })

        // Send success to parent window with the authorization code
        window.opener?.postMessage(
          {
            type: "oauth_success",
            code: code,
            state: stateParam,
          },
          window.location.origin,
        )

        // Auto-close after a short delay
        setTimeout(() => {
          window.close()
        }, 2000)
      } catch (error) {
        console.error("OAuth callback error:", error)
        setState({
          status: "error",
          message: "An unexpected error occurred",
          error: error instanceof Error ? error.message : "Unknown error",
        })

        window.opener?.postMessage(
          {
            type: "oauth_error",
            error: "callback_error",
            description: error instanceof Error ? error.message : "Unknown error",
          },
          window.location.origin,
        )
      }
    }

    handleOAuthCallback()
  }, [])

  const handleRetry = () => {
    window.location.reload()
  }

  const handleClose = () => {
    window.close()
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-white flex items-center justify-center gap-2">
            {state.status === "processing" && (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                Processing OAuth...
              </>
            )}
            {state.status === "success" && (
              <>
                <CheckCircle className="h-5 w-5 text-green-400" />
                Authentication Successful!
              </>
            )}
            {state.status === "error" && (
              <>
                <AlertCircle className="h-5 w-5 text-red-400" />
                Authentication Failed
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-300">{state.message}</p>

          {state.platform && (
            <div className="bg-gray-700/50 p-3 rounded-lg">
              <p className="text-sm text-gray-400">
                Platform: <span className="text-white font-medium">{state.platform}</span>
              </p>
            </div>
          )}

          {state.error && (
            <div className="bg-red-900/20 border border-red-600/30 p-3 rounded-lg">
              <p className="text-red-300 text-sm">{state.error}</p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Your credentials remain completely private
          </div>

          {state.status === "error" && (
            <div className="flex gap-2 pt-4">
              <Button onClick={handleRetry} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                Retry
              </Button>
              <Button onClick={handleClose} variant="outline" className="flex-1">
                Close
              </Button>
            </div>
          )}

          {state.status === "success" && (
            <div className="pt-4">
              <p className="text-xs text-gray-500">This window will close automatically...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
