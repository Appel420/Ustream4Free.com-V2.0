"use client"

export interface StreamingPlatform {
  id: string
  name: string
  displayName: string
  logo: string
  logoUrl?: string
  category: "major" | "gaming" | "social" | "professional" | "alternative" | "international" | "emerging"
  color: string
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
  status: "active" | "beta"
}

export const ALL_STREAMING_PLATFORMS: StreamingPlatform[] = [
  // MAJOR PLATFORMS
  {
    id: "twitch",
    name: "twitch",
    displayName: "Twitch",
    logo: "🟣",
    logoUrl:
      "https://static-cdn.jtvnw.net/jtv_user_pictures/8a6381c7-d0c0-4576-b179-38bd5ce1d6af-profile_image-70x70.png",
    category: "major",
    color: "#9146FF",
    oauth: {
      clientId: "your_twitch_client_id",
      authUrl: "https://id.twitch.tv/oauth2/authorize",
      tokenUrl: "https://id.twitch.tv/oauth2/token",
      scopes: ["channel:read:stream_key", "chat:read", "chat:edit", "channel:manage:broadcast"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.twitch.tv/helix",
      streamEndpoint: "rtmp://live.twitch.tv/live",
      chatEndpoint: "wss://irc-ws.chat.twitch.tv:443",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "youtube",
    name: "youtube",
    displayName: "YouTube Live",
    logo: "🔴",
    logoUrl: "https://www.youtube.com/s/desktop/f506bd45/img/favicon_32x32.png",
    category: "major",
    color: "#FF0000",
    oauth: {
      clientId: "your_youtube_client_id",
      authUrl: "https://accounts.google.com/o/oauth2/v2/auth",
      tokenUrl: "https://oauth2.googleapis.com/token",
      scopes: ["https://www.googleapis.com/auth/youtube", "https://www.googleapis.com/auth/youtube.force-ssl"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://www.googleapis.com/youtube/v3",
      streamEndpoint: "rtmp://a.rtmp.youtube.com/live2",
      chatEndpoint: "https://www.googleapis.com/youtube/v3/liveChat/messages",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 51000, maxResolution: "4k60" },
    status: "active",
  },
  {
    id: "facebook",
    name: "facebook",
    displayName: "Facebook Live",
    logo: "🔵",
    logoUrl: "https://static.xx.fbcdn.net/rsrc.php/yo/r/iRmz9lCMBD2.ico",
    category: "social",
    color: "#1877F2",
    oauth: {
      clientId: "your_facebook_client_id",
      authUrl: "https://www.facebook.com/v18.0/dialog/oauth",
      tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
      scopes: ["publish_video", "pages_show_list", "pages_read_engagement"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://graph.facebook.com/v18.0",
      streamEndpoint: "rtmp://live-api-s.facebook.com:80/rtmp",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 4000, maxResolution: "1080p30" },
    status: "active",
  },
  {
    id: "instagram",
    name: "instagram",
    displayName: "Instagram Live",
    logo: "📷",
    logoUrl: "https://static.cdninstagram.com/rsrc.php/v3/yt/r/30PrGfR3xhB.png",
    category: "social",
    color: "#E4405F",
    oauth: {
      clientId: "your_instagram_client_id",
      authUrl: "https://api.instagram.com/oauth/authorize",
      tokenUrl: "https://api.instagram.com/oauth/access_token",
      scopes: ["instagram_basic", "instagram_content_publish"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://graph.instagram.com",
      streamEndpoint: "rtmp://live-upload.instagram.com/rtmp",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 3500, maxResolution: "1080p30" },
    status: "active",
  },
  {
    id: "tiktok",
    name: "tiktok",
    displayName: "TikTok Live",
    logo: "🎵",
    logoUrl:
      "https://sf16-website-login.neutral.ttwstatic.com/obj/tiktok_web_login_static/tiktok/webapp/main/webapp-desktop/8152caf0c8e8bc67ae0d.png",
    category: "social",
    color: "#000000",
    oauth: {
      clientId: "your_tiktok_client_id",
      authUrl: "https://www.tiktok.com/auth/authorize/",
      tokenUrl: "https://open-api.tiktok.com/oauth/access_token/",
      scopes: ["video.upload", "user.info.basic"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://open-api.tiktok.com",
      streamEndpoint: "rtmp://push.tiktokcdn.com/live",
      chatEndpoint: "wss://webcast.tiktok.com/webcast/im/fetch",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 2000, maxResolution: "720p30" },
    status: "active",
  },
  {
    id: "x",
    name: "x",
    displayName: "X (Twitter)",
    logo: "🐦",
    logoUrl: "https://abs.twimg.com/favicons/twitter.3.ico",
    category: "social",
    color: "#000000",
    oauth: {
      clientId: "your_x_client_id",
      authUrl: "https://twitter.com/i/oauth2/authorize",
      tokenUrl: "https://api.twitter.com/2/oauth2/token",
      scopes: ["tweet.read", "tweet.write", "users.read", "offline.access"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.twitter.com/2",
      streamEndpoint: "https://prod-fastly-us-west-2.video.pscp.tv/Transcoding/v1/hls",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 2500, maxResolution: "720p30" },
    status: "active",
  },

  // GAMING PLATFORMS
  {
    id: "kick",
    name: "kick",
    displayName: "Kick",
    logo: "🟢",
    logoUrl: "https://kick.com/favicon.ico",
    category: "gaming",
    color: "#53FC18",
    oauth: {
      clientId: "your_kick_client_id",
      authUrl: "https://kick.com/oauth2/authorize",
      tokenUrl: "https://kick.com/api/v2/oauth/token",
      scopes: ["streaming", "chat"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://kick.com/api/v2",
      streamEndpoint: "rtmp://ingest.kick.com/live",
      chatEndpoint: "wss://ws-us2.pusher.app/app/32cbd69e4b950bf97679",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 8000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "discord",
    name: "discord",
    displayName: "Discord",
    logo: "🟦",
    logoUrl: "https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png",
    category: "gaming",
    color: "#5865F2",
    oauth: {
      clientId: "your_discord_client_id",
      authUrl: "https://discord.com/api/oauth2/authorize",
      tokenUrl: "https://discord.com/api/oauth2/token",
      scopes: ["bot", "applications.commands", "guilds"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://discord.com/api/v10",
      streamEndpoint: "https://discord.com/api/v10/channels/{channel_id}/call",
      chatEndpoint: "wss://gateway.discord.gg",
    },
    features: { liveStreaming: true, chat: true, analytics: false, multistream: true },
    limits: { maxBitrate: 8000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "trovo",
    name: "trovo",
    displayName: "Trovo",
    logo: "🎮",
    logoUrl: "https://trovo.live/favicon.ico",
    category: "gaming",
    color: "#1ED760",
    oauth: {
      clientId: "your_trovo_client_id",
      authUrl: "https://open.trovo.live/page/login.html",
      tokenUrl: "https://open-api.trovo.live/openplatform/exchangetoken",
      scopes: ["channel_details_self", "chat_send_self"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://open-api.trovo.live/openplatform",
      streamEndpoint: "rtmp://livepush.trovo.live/live",
      chatEndpoint: "wss://open-chat.trovo.live/chat",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "dlive",
    name: "dlive",
    displayName: "DLive",
    logo: "🎯",
    logoUrl: "https://dlive.tv/favicon.ico",
    category: "gaming",
    color: "#FFD700",
    oauth: {
      clientId: "your_dlive_client_id",
      authUrl: "https://dlive.tv/oauth/authorize",
      tokenUrl: "https://graphigo.prd.dlive.tv/",
      scopes: ["stream", "chat"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://graphigo.prd.dlive.tv/",
      streamEndpoint: "rtmp://stream.dlive.tv/live",
      chatEndpoint: "wss://graphigostream.prd.dlive.tv/graphql",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },

  // PROFESSIONAL PLATFORMS
  {
    id: "linkedin",
    name: "linkedin",
    displayName: "LinkedIn Live",
    logo: "💼",
    logoUrl: "https://static.licdn.com/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    category: "professional",
    color: "#0A66C2",
    oauth: {
      clientId: "your_linkedin_client_id",
      authUrl: "https://www.linkedin.com/oauth/v2/authorization",
      tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
      scopes: ["w_member_social", "r_liteprofile"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.linkedin.com/v2",
      streamEndpoint: "rtmp://1-rtmp.linkedin.com/live",
    },
    features: { liveStreaming: true, chat: false, analytics: true, multistream: false },
    limits: { maxBitrate: 4000, maxResolution: "1080p30" },
    status: "active",
  },
  {
    id: "vimeo",
    name: "vimeo",
    displayName: "Vimeo Live",
    logo: "🎬",
    logoUrl: "https://f.vimeocdn.com/images_v6/favicon.ico",
    category: "professional",
    color: "#1AB7EA",
    oauth: {
      clientId: "your_vimeo_client_id",
      authUrl: "https://vimeo.com/oauth/authorize",
      tokenUrl: "https://api.vimeo.com/oauth/access_token",
      scopes: ["public", "private", "create", "edit", "upload"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.vimeo.com",
      streamEndpoint: "rtmp://rtmp.vimeo.com/live",
    },
    features: { liveStreaming: true, chat: false, analytics: true, multistream: false },
    limits: { maxBitrate: 10000, maxResolution: "4k30" },
    status: "active",
  },

  // ALTERNATIVE PLATFORMS
  {
    id: "rumble",
    name: "rumble",
    displayName: "Rumble",
    logo: "🎯",
    logoUrl: "https://rumble.com/favicon.ico",
    category: "alternative",
    color: "#85C742",
    oauth: {
      clientId: "your_rumble_client_id",
      authUrl: "https://rumble.com/oauth/authorize",
      tokenUrl: "https://rumble.com/api/oauth/token",
      scopes: ["stream", "upload"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://rumble.com/api",
      streamEndpoint: "rtmp://live.rumble.com/live",
      chatEndpoint: "wss://chat.rumble.com/chat/ws",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "odysee",
    name: "odysee",
    displayName: "Odysee",
    logo: "🌊",
    logoUrl: "https://odysee.com/favicon.ico",
    category: "alternative",
    color: "#EF4444",
    oauth: {
      clientId: "your_odysee_client_id",
      authUrl: "https://odysee.com/$/oauth/authorize",
      tokenUrl: "https://api.odysee.com/oauth/token",
      scopes: ["stream", "publish"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.odysee.com",
      streamEndpoint: "rtmp://stream.odysee.com/live",
      chatEndpoint: "wss://comments.odysee.com/socket.io",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 8000, maxResolution: "4k30" },
    status: "active",
  },
  {
    id: "bitchute",
    name: "bitchute",
    displayName: "BitChute",
    logo: "📺",
    logoUrl: "https://www.bitchute.com/favicon.ico",
    category: "alternative",
    color: "#FF6B35",
    oauth: {
      clientId: "your_bitchute_client_id",
      authUrl: "https://www.bitchute.com/oauth/authorize",
      tokenUrl: "https://www.bitchute.com/api/oauth/token",
      scopes: ["upload", "stream"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://www.bitchute.com/api",
      streamEndpoint: "rtmp://stream.bitchute.com/live",
    },
    features: { liveStreaming: true, chat: false, analytics: false, multistream: true },
    limits: { maxBitrate: 4000, maxResolution: "1080p30" },
    status: "active",
  },

  // INTERNATIONAL PLATFORMS
  {
    id: "bilibili",
    name: "bilibili",
    displayName: "Bilibili",
    logo: "🇨🇳",
    logoUrl: "https://www.bilibili.com/favicon.ico",
    category: "international",
    color: "#FB7299",
    oauth: {
      clientId: "your_bilibili_client_id",
      authUrl: "https://passport.bilibili.com/oauth2/authorize",
      tokenUrl: "https://passport.bilibili.com/oauth2/access_token",
      scopes: ["live", "user"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.live.bilibili.com",
      streamEndpoint: "rtmp://live-push.bilivideo.com/live-bvc",
      chatEndpoint: "wss://broadcastlv.chat.bilibili.com/sub",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "douyu",
    name: "douyu",
    displayName: "Douyu",
    logo: "🐟",
    logoUrl: "https://www.douyu.com/favicon.ico",
    category: "international",
    color: "#FF6600",
    oauth: {
      clientId: "your_douyu_client_id",
      authUrl: "https://open.douyu.com/api/oauth2/authorize",
      tokenUrl: "https://open.douyu.com/api/oauth2/access_token",
      scopes: ["user_info", "live_info"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://open.douyu.com/api",
      streamEndpoint: "rtmp://send1a.douyu.com/live",
      chatEndpoint: "wss://wss.douyu.com/websocket",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "huya",
    name: "huya",
    displayName: "Huya",
    logo: "🐅",
    logoUrl: "https://www.huya.com/favicon.ico",
    category: "international",
    color: "#FF7F00",
    oauth: {
      clientId: "your_huya_client_id",
      authUrl: "https://open.huya.com/oauth2/authorize",
      tokenUrl: "https://open.huya.com/oauth2/access_token",
      scopes: ["user_info", "live_info"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://open.huya.com/api",
      streamEndpoint: "rtmp://tx.flv.huya.com/src",
      chatEndpoint: "wss://cdnws.api.huya.com",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "afreecatv",
    name: "afreecatv",
    displayName: "AfreecaTV",
    logo: "🇰🇷",
    logoUrl: "https://www.afreecatv.com/favicon.ico",
    category: "international",
    color: "#FF4500",
    oauth: {
      clientId: "your_afreecatv_client_id",
      authUrl: "https://login.afreecatv.com/afreeca/login_oauth.php",
      tokenUrl: "https://openapi.afreecatv.com/oauth/token",
      scopes: ["read", "write"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://openapi.afreecatv.com",
      streamEndpoint: "rtmp://liveout.afreecatv.com:1935/app",
      chatEndpoint: "wss://live.afreecatv.com/websocket",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: false },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },

  // EMERGING PLATFORMS
  {
    id: "caffeine",
    name: "caffeine",
    displayName: "Caffeine",
    logo: "☕",
    logoUrl: "https://www.caffeine.tv/favicon.ico",
    category: "emerging",
    color: "#FF6B6B",
    oauth: {
      clientId: "your_caffeine_client_id",
      authUrl: "https://api.caffeine.tv/oauth/authorize",
      tokenUrl: "https://api.caffeine.tv/oauth/token",
      scopes: ["broadcast", "user"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.caffeine.tv",
      streamEndpoint: "rtmp://ingest.caffeine.tv/live",
      chatEndpoint: "wss://realtime.caffeine.tv/v2/realtimeapi",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "theta",
    name: "theta",
    displayName: "Theta.tv",
    logo: "🎭",
    logoUrl: "https://www.theta.tv/favicon.ico",
    category: "emerging",
    color: "#2E8B57",
    oauth: {
      clientId: "your_theta_client_id",
      authUrl: "https://api.theta.tv/oauth/authorize",
      tokenUrl: "https://api.theta.tv/oauth/token",
      scopes: ["stream", "user"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://api.theta.tv",
      streamEndpoint: "rtmp://ingest.theta.tv/live",
      chatEndpoint: "wss://chat-ws-theta.sliver.tv",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "glimesh",
    name: "glimesh",
    displayName: "Glimesh",
    logo: "✨",
    logoUrl: "https://glimesh.tv/favicon.ico",
    category: "emerging",
    color: "#0E7490",
    oauth: {
      clientId: "your_glimesh_client_id",
      authUrl: "https://glimesh.tv/oauth/authorize",
      tokenUrl: "https://glimesh.tv/api/oauth/token",
      scopes: ["public", "chat"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://glimesh.tv/api",
      streamEndpoint: "rtmp://ingest.glimesh.tv/live",
      chatEndpoint: "wss://glimesh.tv/api/socket/websocket",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
  {
    id: "nimo",
    name: "nimo",
    displayName: "Nimo TV",
    logo: "🎪",
    logoUrl: "https://www.nimo.tv/favicon.ico",
    category: "emerging",
    color: "#FF1744",
    oauth: {
      clientId: "your_nimo_client_id",
      authUrl: "https://www.nimo.tv/oauth/authorize",
      tokenUrl: "https://www.nimo.tv/api/oauth/token",
      scopes: ["stream", "user"],
      redirectUri: `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback`,
    },
    api: {
      baseUrl: "https://www.nimo.tv/api",
      streamEndpoint: "rtmp://txpush.rtmp.nimo.tv/live",
      chatEndpoint: "wss://ws.nimo.tv/websocket",
    },
    features: { liveStreaming: true, chat: true, analytics: true, multistream: true },
    limits: { maxBitrate: 6000, maxResolution: "1080p60" },
    status: "active",
  },
]

export function getPlatformsByCategory(category: string): StreamingPlatform[] {
  return ALL_STREAMING_PLATFORMS.filter((platform) => platform.category === category)
}

export function getAllPlatforms(): StreamingPlatform[] {
  return ALL_STREAMING_PLATFORMS
}

export function getPlatformById(id: string): StreamingPlatform | undefined {
  return ALL_STREAMING_PLATFORMS.find((platform) => platform.id === id)
}

export const PLATFORM_CATEGORIES = [
  { id: "major", name: "Major Platforms", count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "major").length },
  { id: "gaming", name: "Gaming", count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "gaming").length },
  { id: "social", name: "Social Media", count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "social").length },
  {
    id: "professional",
    name: "Professional",
    count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "professional").length,
  },
  {
    id: "alternative",
    name: "Alternative",
    count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "alternative").length,
  },
  {
    id: "international",
    name: "International",
    count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "international").length,
  },
  { id: "emerging", name: "Emerging", count: ALL_STREAMING_PLATFORMS.filter((p) => p.category === "emerging").length },
]
