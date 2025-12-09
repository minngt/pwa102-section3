# Playwright Reporter - Better Bytes Academy

Web-based dashboard để xem và quản lý Playwright test reports với khả năng chia sẻ online qua tunnel.

## Features

- Dashboard hiển thị danh sách test reports
- Sort và search reports
- Download reports trực tiếp
- **Open reports online** với Playwright Trace Viewer
- Auto-refresh danh sách reports
- Responsive design

## Prerequisites

- Docker & Docker Compose
- Một trong các tunnel tools:
  - **Cloudflare Tunnel** (recommended - free, no warning page)
  - Ngrok (paid plan để tránh warning page)

## Quick Start

### 1. Clone/Setup project

```bash
cd /path/to/project
```

### 2. Start Docker services

```bash
docker-compose up -d
```

Server sẽ chạy tại `http://localhost:8080`

### 3. Expose online với Cloudflare Tunnel

#### Windows:

**Install cloudflared:**
```powershell
# Option 1: Dùng winget (Windows 10/11)
winget install --id Cloudflare.cloudflared

# Option 2: Dùng Chocolatey
choco install cloudflared
```

**Start tunnel:**
```powershell
cloudflared tunnel --url http://localhost:8080
```

#### macOS:

```bash
# Install
brew install cloudflare/cloudflare/cloudflared

# Start tunnel
cloudflared tunnel --url http://localhost:8080
```

#### Linux:

```bash
# Install
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Start tunnel
cloudflared tunnel --url http://localhost:8080
```

Bạn sẽ nhận được URL kiểu: `https://random-words.trycloudflare.com`

## Project Structure

```
.
├── docker-compose.yml          # Docker compose config
├── nginx-docker.conf           # Nginx configuration
├── report-html/
│   ├── index.html             # Main dashboard
│   ├── reports/               # Folder chứa test reports (zip files)
│   └── nginx.conf             # Original nginx config (reference)
└── README.md
```

## Usage

### Thêm reports vào dashboard

Copy các file `.zip` Playwright trace vào thư mục:
```bash
cp /path/to/trace.zip report-html/reports/
```

Refresh browser hoặc click nút "Refresh" trên dashboard.

### Xem report online

1. Click nút **"Open Report"** trên dashboard
2. Playwright Trace Viewer sẽ mở trong tab mới
3. Trace file sẽ được load từ public URL

### Download report

Click vào tên file để download về máy.

## Configuration

### Thay đổi port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Change 8080 to your desired port
```

Sau đó restart:
```bash
docker-compose down
docker-compose up -d
```

### Custom nginx config

Edit file `nginx-docker.conf` và restart container:
```bash
docker-compose restart nginx
```

## Troubleshooting

### Issue: "Could not load trace from URL"

**Nguyên nhân:** Ngrok free có warning page

**Giải pháp:**
1. Dùng Cloudflare Tunnel thay vì ngrok
2. Hoặc upgrade ngrok lên paid plan
3. Hoặc dùng local viewer: `npx playwright show-trace <url>`

### Issue: Reports không hiển thị

**Kiểm tra:**
1. Files có trong `report-html/reports/`?
   ```bash
   ls report-html/reports/
   ```
2. Nginx container đang chạy?
   ```bash
   docker-compose ps
   ```
3. Check logs:
   ```bash
   docker-compose logs nginx
   ```

### Issue: Port 8080 đã được sử dụng

Thay đổi port trong `docker-compose.yml` (xem phần Configuration)

## Commands Reference

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f nginx

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Remove all containers and volumes
docker-compose down -v
```

## Tech Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Web Server:** Nginx (Alpine)
- **Container:** Docker & Docker Compose
- **Tunneling:** Cloudflare Tunnel / Ngrok
- **Trace Viewer:** Playwright Trace Viewer (trace.playwright.dev)

## Notes

- Cloudflare Tunnel URL sẽ thay đổi mỗi khi restart (trừ khi dùng named tunnel)
- Files trong `report-html/` được mount read-only vào container
- Dashboard tự động parse nginx autoindex để hiển thị files

## Author

Better Bytes Academy - Playwright Reporter

Made with ❤️ for testing teams
