export interface OAuthConfig {
  clientId: string
  clientSecret?: string
  redirectUri: string
  scopes: string[]
  authUrl: string
  tokenUrl: string
  revokeUrl?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope?: string
}

export class OAuthService {
  private static instance: OAuthService
  private tokens: Map<string, TokenResponse & { expires_at: number }> = new Map()
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): OAuthService {
    if (!OAuthService.instance) {
      OAuthService.instance = new OAuthService()
    }
    return OAuthService.instance
  }

  async startOAuthFlow(platformId: string, config: OAuthConfig): Promise<string> {
    const state = this.generateState()
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)

    // Store PKCE data
    sessionStorage.setItem(`oauth_state_${platformId}`, state)
    sessionStorage.setItem(`oauth_verifier_${platformId}`, codeVerifier)

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      response_type: "code",
      scope: config.scopes.join(" "),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    return `${config.authUrl}?${params.toString()}`
  }

  async handleCallback(platformId: string, code: string, state: string, config: OAuthConfig): Promise<TokenResponse> {
    // Verify state
    const storedState = sessionStorage.getItem(`oauth_state_${platformId}`)
    if (state !== storedState) {
      throw new Error("Invalid state parameter")
    }

    const codeVerifier = sessionStorage.getItem(`oauth_verifier_${platformId}`)
    if (!codeVerifier) {
      throw new Error("Code verifier not found")
    }

    // Exchange code for token
    const tokenData = await this.exchangeCodeForToken(code, config, codeVerifier)

    // Store token with expiry
    const expiresAt = Date.now() + tokenData.expires_in * 1000
    this.tokens.set(platformId, { ...tokenData, expires_at: expiresAt })

    // Set up auto-refresh
    this.scheduleTokenRefresh(platformId, config, tokenData.expires_in)

    // Cleanup
    sessionStorage.removeItem(`oauth_state_${platformId}`)
    sessionStorage.removeItem(`oauth_verifier_${platformId}`)

    return tokenData
  }

  private async exchangeCodeForToken(code: string, config: OAuthConfig, codeVerifier: string): Promise<TokenResponse> {
    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.clientId,
        client_secret: config.clientSecret || "",
        code: code,
        redirect_uri: config.redirectUri,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`)
    }

    return response.json()
  }

  private scheduleTokenRefresh(platformId: string, config: OAuthConfig, expiresIn: number) {
    // Refresh 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000

    const timer = setTimeout(async () => {
      try {
        await this.refreshToken(platformId, config)
      } catch (error) {
        console.error(`Failed to refresh token for ${platformId}:`, error)
      }
    }, refreshTime)

    this.refreshTimers.set(platformId, timer)
  }

  private async refreshToken(platformId: string, config: OAuthConfig): Promise<void> {
    const tokenData = this.tokens.get(platformId)
    if (!tokenData?.refresh_token) {
      throw new Error("No refresh token available")
    }

    const response = await fetch(config.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: config.clientId,
        client_secret: config.clientSecret || "",
        refresh_token: tokenData.refresh_token,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const newTokenData = await response.json()
    const expiresAt = Date.now() + newTokenData.expires_in * 1000

    this.tokens.set(platformId, { ...newTokenData, expires_at: expiresAt })
    this.scheduleTokenRefresh(platformId, config, newTokenData.expires_in)
  }

  getToken(platformId: string): string | null {
    const tokenData = this.tokens.get(platformId)
    if (!tokenData || Date.now() >= tokenData.expires_at) {
      return null
    }
    return tokenData.access_token
  }

  isAuthenticated(platformId: string): boolean {
    return this.getToken(platformId) !== null
  }

  revokeToken(platformId: string): void {
    this.tokens.delete(platformId)
    const timer = this.refreshTimers.get(platformId)
    if (timer) {
      clearTimeout(timer)
      this.refreshTimers.delete(platformId)
    }
  }

  private generateState(): string {
    return btoa(crypto.getRandomValues(new Uint8Array(32)).toString())
  }

  private generateCodeVerifier(): string {
    return btoa(crypto.getRandomValues(new Uint8Array(32)).toString())
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  }

  private async generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const digest = await crypto.subtle.digest("SHA-256", data)
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  }
}
