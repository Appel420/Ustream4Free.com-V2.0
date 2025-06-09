chmod +x bootstrap-stream.sh
./bootstrap-stream.sh
#!/usr/bin/env bash
set -e

# 1) Ensure on v2.0 branch
git fetch origin v2.0
git checkout -B v2.0 origin/v2.0

# 2) Update .gitignore
cat << 'EOF' >> .gitignore

# env + certs
.env
cert-data/
EOF

git add .gitignore
git commit -m "🔒 ignore .env and cert-data"

# 3) Create .env.example
cat > .env.example << 'EOF'
# HTTP & API
API_HOST=                # https://stream.yourdomain.com
API_PORT=443

# RTMP ingest + HLS/HTTP
RTMP_PORT=1935
HTTP_PORT=8000

# TURN/STUN (for future WebRTC if needed)
STUN_SERVERS=stun:stun.l.google.com:19302
TURN_URL=turn:global.turn.twilio.com:3478
TURN_USERNAME=
TURN_CREDENTIAL=

# Auth
JWT_SECRET=
FFMPEG_PATH=ffmpeg
EOF

git add .env.example
git commit -m "📄 add .env.example with all required vars"

# 4) Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --production
COPY . .
EXPOSE 1935 8000 3000
CMD ["node", "server.js"]
EOF

git add Dockerfile
git commit -m "🐳 add Dockerfile for NodeMediaServer + API"

# 5) docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  app:
    build: .
    restart: always
    env_file:
      - .env
    ports:
      - "1935:1935"
      - "8000:8000"
      - "3000:3000"

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - cert-data:/etc/letsencrypt

volumes:
  cert-data:
EOF

git add docker-compose.yml
git commit -m "🛠️ add docker-compose.yml for app + nginx"

# 6) nginx.conf
cat > nginx.conf << 'EOF'
events { }

http {
  server {
    listen 80;
    server_name stream.yourdomain.com;

    location /.well-known/acme-challenge/ {
      root /var/www/certbot;
    }
    location / {
      return 301 https://$host$request_uri;
    }
  }

  server {
    listen 443 ssl http2;
    server_name stream.yourdomain.com;

    ssl_certificate     /etc/letsencrypt/live/stream.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stream.yourdomain.com/privkey.pem;

    # API proxy
    location /api/ {
      proxy_pass http://app:3000/api/;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "keep-alive";
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
    }

    # HLS (optional)
    location /live/ {
      proxy_pass http://app:8000/live/;
    }
  }
}
EOF

git add nginx.conf
git commit -m "🔧 add nginx.conf with HTTP→HTTPS and API/HLS proxy rules"

# 7) Final tip in README
cat << 'EOF' >> README.md

## 🚀 Docker + RTMP Quickstart

1. Copy `.env.example` → `.env` and fill in your values
2. `docker-compose up -d nginx`  
3. Issue SSL cert (on VM):
4. `docker-compose up -d app`
5. Point OBS to `rtmp://stream.yourdomain.com/live` + your `/api/key`

EOF

git add README.md
git commit -m "📝 update README with Docker + SSL + OBS quickstart"

echo "✅ Bootstrapping complete. Please edit .env with your real values, then push."
Server: rtmp://stream.yourdomain.com/live  
Stream Key: <yourKey>