import type { PlatformConfig } from "./platform-registry"

export interface OAuthCredentials {
  clientId: string
  clientSecret?: string
  redirectUri: string
}

export interface TokenData {
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
  scope?: string
  expires_at: number
}

export class SecureOAuthManager {
  private static instance: SecureOAuthManager
  private credentials: Map<string, OAuthCredentials> = new Map()
  private tokens: Map<string, TokenData> = new Map()
  private refreshTimers: Map<string, NodeJS.Timeout> = new Map()

  static getInstance(): SecureOAuthManager {
    if (!SecureOAuthManager.instance) {
      SecureOAuthManager.instance = new SecureOAuthManager()
    }
    return SecureOAuthManager.instance
  }

  setCredentials(platformId: string, credentials: OAuthCredentials): void {
    this.credentials.set(platformId, credentials)
  }

  getCredentials(platformId: string): OAuthCredentials | null {
    return this.credentials.get(platformId) || null
  }

  async startOAuthFlowInternal(platformId: string, platformConfig: PlatformConfig): Promise<string> {
    const credentials = this.getCredentials(platformId)
    if (!credentials) {
      throw new Error(`No credentials found for platform: ${platformId}`)
    }

    const state = this.generateState()
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = await this.generateCodeChallenge(codeVerifier)

    // Store PKCE data
    sessionStorage.setItem(`oauth_state_${platformId}`, state)
    sessionStorage.setItem(`oauth_verifier_${platformId}`, codeVerifier)

    const params = new URLSearchParams({
      client_id: credentials.clientId,
      redirect_uri: credentials.redirectUri,
      response_type: "code",
      scope: platformConfig.oauth.scopes.join(" "),
      state: state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    })

    return `${platformConfig.oauth.authUrl}?${params.toString()}`
  }

  async handleCallbackInternal(
    platformId: string,
    code: string,
    state: string,
    platformConfig: PlatformConfig,
  ): Promise<TokenData> {
    // Verify state
    const storedState = sessionStorage.getItem(`oauth_state_${platformId}`)
    if (state !== storedState) {
      throw new Error("Invalid state parameter")
    }

    const credentials = this.getCredentials(platformId)
    if (!credentials) {
      throw new Error(`No credentials found for platform: ${platformId}`)
    }

    const codeVerifier = sessionStorage.getItem(`oauth_verifier_${platformId}`)
    if (!codeVerifier) {
      throw new Error("Code verifier not found")
    }

    // Exchange code for token
    const tokenData = await this.exchangeCodeForToken(code, credentials, platformConfig, codeVerifier)

    // Store token with expiry
    const expiresAt = Date.now() + tokenData.expires_in * 1000
    const tokenWithExpiry = { ...tokenData, expires_at: expiresAt }
    this.tokens.set(platformId, tokenWithExpiry)

    // Set up auto-refresh
    this.scheduleTokenRefresh(platformId, platformConfig, tokenData.expires_in)

    // Cleanup
    sessionStorage.removeItem(`oauth_state_${platformId}`)
    sessionStorage.removeItem(`oauth_verifier_${platformId}`)

    return tokenWithExpiry
  }

  private async exchangeCodeForToken(
    code: string,
    credentials: OAuthCredentials,
    platformConfig: PlatformConfig,
    codeVerifier: string,
  ): Promise<TokenData> {
    const response = await fetch(platformConfig.oauth.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...platformConfig.oauth.headers,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret || "",
        code: code,
        redirect_uri: credentials.redirectUri,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Token exchange failed: ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  private scheduleTokenRefresh(platformId: string, platformConfig: PlatformConfig, expiresIn: number) {
    // Refresh 5 minutes before expiry
    const refreshTime = Math.max(0, (expiresIn - 300) * 1000)

    const timer = setTimeout(async () => {
      try {
        await this.refreshToken(platformId, platformConfig)
      } catch (error) {
        console.error(`Failed to refresh token for ${platformId}:`, error)
        this.tokens.delete(platformId)
      }
    }, refreshTime)

    // Clear existing timer
    const existingTimer = this.refreshTimers.get(platformId)
    if (existingTimer) {
      clearTimeout(existingTimer)
    }

    this.refreshTimers.set(platformId, timer)
  }

  private async refreshToken(platformId: string, platformConfig: PlatformConfig): Promise<void> {
    const tokenData = this.tokens.get(platformId)
    if (!tokenData?.refresh_token) {
      throw new Error("No refresh token available")
    }

    const credentials = this.getCredentials(platformId)
    if (!credentials) {
      throw new Error(`No credentials found for platform: ${platformId}`)
    }

    const response = await fetch(platformConfig.oauth.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...platformConfig.oauth.headers,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret || "",
        refresh_token: tokenData.refresh_token,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`)
    }

    const newTokenData = await response.json()
    const expiresAt = Date.now() + newTokenData.expires_in * 1000

    this.tokens.set(platformId, { ...newTokenData, expires_at: expiresAt })
    this.scheduleTokenRefresh(platformId, platformConfig, newTokenData.expires_in)
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

  getAllTokens(): Map<string, TokenData> {
    return new Map(this.tokens)
  }

  private generateState(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "")
  }

  private generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
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

  hasCredentials(platformId: string): boolean {
    return this.credentials.has(platformId)
  }

  getAvailablePlatforms(): string[] {
    return Array.from(this.credentials.keys())
  }

  setCredentials(platformId: string, clientId: string, clientSecret: string): void {
    const credentials: OAuthCredentials = {
      clientId,
      clientSecret,
      redirectUri: `${window.location.origin}/oauth/callback`,
    }
    this.credentials.set(platformId, credentials)
  }

  async startOAuthFlow(platformId: string): Promise<string> {
    // Import the platform registry to get platform config
    const { getPlatformById } = await import("./platform-registry")
    const platformConfig = getPlatformById(platformId)

    if (!platformConfig) {
      throw new Error(`Platform not found: ${platformId}`)
    }

    return this.startOAuthFlowInternal(platformId, platformConfig)
  }

  async handleCallback(code: string, state: string, platformId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Import the platform registry to get platform config
      const { getPlatformById } = await import("./platform-registry")
      const platformConfig = getPlatformById(platformId)

      if (!platformConfig) {
        throw new Error(`Platform not found: ${platformId}`)
      }

      await this.handleCallbackInternal(platformId, code, state, platformConfig)
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  getOAuthConfig(platformId: string): { isAuthenticated: boolean; tokenExpiresAt?: number } | null {
    const token = this.tokens.get(platformId)
    if (!token) {
      return this.hasCredentials(platformId) ? { isAuthenticated: false } : null
    }

    return {
      isAuthenticated: Date.now() < token.expires_at,
      tokenExpiresAt: token.expires_at,
    }
  }
}
