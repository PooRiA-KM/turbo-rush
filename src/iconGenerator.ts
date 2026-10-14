// Generate PNG icons at runtime for Safari/iOS compatibility
export function generatePNGIcon(size: number = 192): string {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const s = size / 512; // Scale factor

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0f0c29');
  bgGrad.addColorStop(0.5, '#302b63');
  bgGrad.addColorStop(1, '#24243e');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Road
  const roadLeft = 128 * s;
  const roadWidth = 256 * s;
  ctx.fillStyle = '#2d2d2d';
  ctx.fillRect(roadLeft, 0, roadWidth, size);

  // Road edges
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.fillRect(roadLeft - 4 * s, 0, 4 * s, size);
  ctx.fillRect(roadLeft + roadWidth, 0, 4 * s, size);

  // Lane markings
  ctx.fillStyle = '#ffdd00';
  for (let y = 40 * s; y < size; y += 70 * s) {
    // Left lane
    ctx.beginPath();
    ctx.roundRect(190 * s, y, 6 * s, 35 * s, 3 * s);
    ctx.fill();
    // Right lane
    ctx.beginPath();
    ctx.roundRect(316 * s, y, 6 * s, 35 * s, 3 * s);
    ctx.fill();
  }

  // Car body
  const carX = 256 * s;
  const carY = 280 * s;
  const carW = 70 * s;
  const carH = 100 * s;

  // Car shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(carX, carY + carH * 0.55, carW * 0.45, carH * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car body gradient
  const carGrad = ctx.createLinearGradient(carX - carW / 2, carY - carH / 2, carX + carW / 2, carY + carH / 2);
  carGrad.addColorStop(0, '#00e5ff');
  carGrad.addColorStop(1, '#0099cc');
  ctx.fillStyle = carGrad;
  ctx.beginPath();
  ctx.roundRect(carX - carW / 2, carY - carH / 2, carW, carH, 14 * s);
  ctx.fill();

  // Windshield
  ctx.fillStyle = 'rgba(26, 26, 46, 0.85)';
  ctx.beginPath();
  ctx.roundRect(carX - 25 * s, carY - 30 * s, 50 * s, 28 * s, 7 * s);
  ctx.fill();

  // Headlights
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.ellipse(carX - 20 * s, carY - 42 * s, 6 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(carX + 20 * s, carY - 42 * s, 6 * s, 5 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Taillights
  ctx.fillStyle = '#ff3333';
  ctx.beginPath();
  ctx.ellipse(carX - 20 * s, carY + 42 * s, 6 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(carX + 20 * s, carY + 42 * s, 6 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fill();

  // Racing stripe
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(carX - 4 * s, carY - carH / 2, 8 * s, carH);

  // Side mirrors
  ctx.fillStyle = '#333';
  ctx.fillRect(carX - carW / 2 - 8 * s, carY - 15 * s, 8 * s, 12 * s);
  ctx.fillRect(carX + carW / 2, carY - 15 * s, 8 * s, 12 * s);

  // Glow effect
  const glowGrad = ctx.createRadialGradient(carX, carY, 0, carX, carY, 80 * s);
  glowGrad.addColorStop(0, 'rgba(0, 212, 255, 0.15)');
  glowGrad.addColorStop(1, 'rgba(0, 212, 255, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(carX, carY, 80 * s, 0, Math.PI * 2);
  ctx.fill();

  return canvas.toDataURL('image/png');
}

// Set the generated PNG as apple-touch-icon
export function setAppleTouchIcon() {
  const pngDataUrl = generatePNGIcon(180); // iOS uses 180x180
  
  // Remove existing apple-touch-icon links
  const existingIcons = document.querySelectorAll('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
  existingIcons.forEach(icon => icon.remove());

  // Add new PNG icon
  const link = document.createElement('link');
  link.rel = 'apple-touch-icon';
  link.href = pngDataUrl;
  link.sizes = '180x180';
  document.head.appendChild(link);

  // Also set as regular icon for browsers that prefer PNG
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/png';
  favicon.href = generatePNGIcon(32);
  favicon.sizes = '32x32';
  document.head.appendChild(favicon);
}

// Generate and cache the icon
let cachedIcon: string | null = null;
export function getIconDataUrl(size: number = 192): string {
  if (!cachedIcon) {
    cachedIcon = generatePNGIcon(size);
  }
  return cachedIcon;
}
