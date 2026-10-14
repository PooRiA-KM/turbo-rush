# Turbo Rush - Motor Racing Game

A responsive motor racing web game built with React, Vite, and Tailwind CSS.

## 🏎️ Features

- **Top-down racing gameplay** with smooth 60fps canvas rendering
- **Responsive design** - works on desktop, tablet, and mobile
- **Touch controls** for mobile devices
- **Keyboard controls** for desktop (Arrow keys or WASD)
- **Progressive difficulty** - gets harder as you score more
- **High score tracking** with localStorage
- **Visual effects** - particles, speed lines, rumble strips
- **Pause functionality** (ESC key)

## 🎮 Controls

### Desktop
- **← → (or A/D)**: Move left/right
- **↑ (or W)**: Accelerate
- **↓ (or S)**: Brake
- **ESC**: Pause/Resume

### Mobile
- Touch buttons appear at the bottom of the screen
- Left/Right arrows for steering
- Up/Down arrows for acceleration/braking

## 🚀 Deployment on Ubuntu Server

### Prerequisites
- Ubuntu 22.04 (or 20.04+)
- Node.js 18+ (for building)
- Nginx or Apache (for serving)

### Option 1: Deploy with Nginx

1. **Install Nginx:**
```bash
sudo apt update
sudo apt install nginx -y
```

2. **Copy build files:**
```bash
sudo mkdir -p /var/www/turbo-rush
sudo cp -r dist/* /var/www/turbo-rush/
```

3. **Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/turbo-rush
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP
    
    root /var/www/turbo-rush;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

4. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/turbo-rush /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 2: Deploy with Apache

1. **Install Apache:**
```bash
sudo apt update
sudo apt install apache2 -y
```

2. **Copy build files:**
```bash
sudo mkdir -p /var/www/html/turbo-rush
sudo cp -r dist/* /var/www/html/turbo-rush/
```

3. **Enable mod_rewrite:**
```bash
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### Option 3: Quick Deploy with Python HTTP Server (Testing)

```bash
cd dist
python3 -m http.server 8080
```

Then access at `http://your-server-ip:8080`

### Option 4: Deploy with Docker

Create a `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t turbo-rush .
docker run -d -p 80:80 turbo-rush
```

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
├── dist/               # Production build output
├── src/
│   ├── App.tsx         # Main app component with game state management
│   ├── main.tsx        # Entry point
│   ├── index.css       # Global styles
│   └── components/
│       ├── Game.tsx    # Main game canvas and logic
│       ├── MainMenu.tsx # Start screen
│       └── GameOver.tsx # Game over screen
├── index.html          # HTML entry point
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome for Android)

## 📝 License

MIT
