// Procedural 8-bit backdrops. Ported from the original draw functions, with two
// optimizations applied in renderer.js: the sky gradient is cached per time-of-
// day band (was reallocated 60x/sec) and the active backdrop is chosen via a tag
// registry on scene change (was an if/else chain re-evaluated every frame).
//
// These functions are heavily animated (scrolling code, strobing lasers, moving
// bus), so they legitimately run each frame. They share module-scoped render
// state initialized by initRenderState().

let ctx, width, height;
let frameCount = 0;
let busX = -120;
let particles = [];
let stars = [];
let leaves = [];

export function initRenderState(context, w, h) {
  ctx = context;
  width = w;
  height = h;
  stars = Array.from({ length: 40 }, () => ({
    x: Math.random() * width, y: Math.random() * 80, speed: 0.1 + Math.random() * 0.5,
  }));
  leaves = Array.from({ length: 15 }, () => ({
    x: Math.random() * width, y: Math.random() * height,
    r: 1.5 + Math.random() * 1.5, speed: 0.2 + Math.random() * 0.4,
  }));
}

export function tickFrame() { frameCount++; }
export function getFrame() { return frameCount; }
export function getStars() { return stars; }

export function drawCityBackdrop(frame) {
    ctx.fillStyle = "#1e293b";
    // Far mountains or tall skylines
    const buildingHeights = [40, 70, 55, 90, 80, 65, 45, 75];
    const w = 40;
    for (let i = 0; i < buildingHeights.length; i++) {
        const x = i * w;
        const h = buildingHeights[i];
        ctx.fillStyle = i % 2 === 0 ? "#0f172a" : "#1e293b";
        ctx.fillRect(x, height - h - 30, w, h);
        
        // Little yellow amber window dots inside building boxes
        ctx.fillStyle = "rgba(251, 191, 36, 0.5)";
        for (let wy = height - h - 20; wy < height - 40; wy += 12) {
            for (let wx = x + 5; wx < x + w - 5; wx += 10) {
                if ((wx + wy + Math.floor(frame/40)) % 7 !== 0) {
                    ctx.fillRect(wx, wy, 2, 2);
                }
            }
        }
    }
}

export function drawHighway(groundColor) {
    ctx.fillStyle = "#111827"; // Dark tarmac asphalt
    ctx.fillRect(0, height - 35, width, 35);
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, height - 5, width, 5);

    // Blinking road dashed line markers
    ctx.fillStyle = "#eab308";
    const scroll = Math.floor(frameCount * 1.5);
            for (let rx = -50 + scroll % 60; rx < width; rx += 60) {
        ctx.fillRect(rx, height - 18, 15, 2);
    }
}

export function drawGreyhoundBus() {
    busX += 1.2;
    if (busX > width + 40) busX = -120;

    const y = height - 44;
    // Shadows
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    ctx.fillRect(busX - 5, y + 18, 90, 5);

    // Bus chassis body
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(busX, y, 80, 20);
    ctx.fillStyle = "#1e3a8a"; // Blue secondary stripe
    ctx.fillRect(busX, y + 10, 80, 4);

    // Windows
    ctx.fillStyle = "#1e293b";
    for (let k = 0; k < 6; k++) {
        ctx.fillRect(busX + 8 + k * 10, y + 3, 7, 5);
    }
    // Drivers windshield
    ctx.fillRect(busX + 68, y + 3, 10, 8);

    // Wheels
    ctx.fillStyle = "#374151";
    ctx.fillRect(busX + 12, y + 18, 8, 4);
    ctx.fillRect(busX + 60, y + 18, 8, 4);
    
    // Tailpipe exhaust particles
    if (frameCount % 8 === 0) {
        particles.push({ x: busX, y: y + 16, life: 20 });
    }

    // Render & Fade particles
    ctx.fillStyle = "rgba(107, 114, 128, 0.6)";
    particles.forEach((p, idx) => {
        p.x -= 0.5;
        p.y -= 0.2;
        p.life--;
        ctx.fillRect(p.x, p.y, 2, 2);
    });
    particles = particles.filter(p => p.life > 0);
}

export function drawHackerHouse(frame) {
    // Desk layout backdrop
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 0, width, height);

    // PC Monitor Frame
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(60, 40, 110, 90);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(68, 46, 94, 72);

    // Grid computer scrolling lines
    ctx.fillStyle = "#22c55e";
    for (let i = 0; i < 6; i++) {
        const lineY = 52 + ((i * 12 + Math.floor(frame / 2)) % 66);
        ctx.fillRect(72, lineY, 80, 1);
        ctx.fillRect(75, lineY + 3, 40, 1.5);
    }

    // Blinking matrix terminal green cursors
    if (Math.floor(frame / 15) % 2 === 0) {
        ctx.fillRect(145, 110, 6, 6);
    }

    // Cozy table desk lamp radial light cone
    ctx.fillStyle = "rgba(253, 224, 71, 0.15)";
    ctx.beginPath();
    ctx.moveTo(250, 10);
    ctx.lineTo(190, height);
    ctx.lineTo(310, height);
    ctx.closePath();
    ctx.fill();

    // Lamp base
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(245, 10, 10, 50);
    ctx.fillStyle = "#334155";
    ctx.fillRect(235, 60, 30, 6);

    // Small steaming coffee mug with active rising smoke vector lines
    ctx.fillStyle = "#3b82f6";
    ctx.fillRect(200, 120, 12, 14);
    ctx.fillRect(194, 124, 6, 2); // handle

    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    const smokeOffset = Math.sin(frame * 0.1) * 2;
    ctx.fillRect(202 + smokeOffset, 112 - (frame % 8), 1, 4);
    ctx.fillRect(208 - smokeOffset, 115 - ((frame + 4) % 8), 1, 4);
}

export function drawVaporwaveMixer(frame) {
    // Dark room
    ctx.fillStyle = "#110c1a";
    ctx.fillRect(0, 0, width, height);

    // Isometric neon grid floor lines perspective
    ctx.strokeStyle = "#ec4899";
    ctx.lineWidth = 1;
    const horizon = 80;
    
    // Horizontal lines getting closer
    for (let ly = horizon; ly < height; ly += 8) {
        const step = (ly - horizon) / (height - horizon);
        const screenY = horizon + Math.pow(step, 1.5) * (height - horizon);
        ctx.beginPath();
        ctx.moveTo(0, screenY);
        ctx.lineTo(width, screenY);
        ctx.stroke();
    }
    // Vertical rays
    for (let rx = -100; rx < width + 100; rx += 25) {
        ctx.beginPath();
        ctx.moveTo(width / 2, horizon);
        ctx.lineTo(rx, height);
        ctx.stroke();
    }

    // Glowing pink sunset circle sun in background horizon
    const sunY = horizon - 20;
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(width / 2, sunY, 30, 0, Math.PI, true);
    ctx.fill();

    // Sliced vector bars to simulate outrun retro style
    ctx.fillStyle = "#110c1a";
    for (let sy = sunY - 30; sy < sunY; sy += 5) {
        ctx.fillRect(width / 2 - 32, sy, 64, 1.5);
    }

    // Moving colored strobe laser beams
    ctx.fillStyle = "rgba(6, 182, 212, 0.15)";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(width / 2 + Math.sin(frame * 0.02) * 80, height);
    ctx.lineTo(width / 2 + Math.sin(frame * 0.02) * 80 + 30, height);
    ctx.closePath();
    ctx.fill();

    // Silhouetted bouncing dancing developers partying
    ctx.fillStyle = "#020205";
    for (let b = 0; b < 6; b++) {
        const bx = 30 + b * 50 + Math.sin(frame * 0.05 + b) * 3;
        const by = height - 10 - Math.abs(Math.sin(frame * 0.1 + b) * 8);
        // Body
        ctx.fillRect(bx, by, 10, 20);
        // Head
        ctx.beginPath();
        ctx.arc(bx + 5, by - 4, 3.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function drawParkCampus(groundColor, frame) {
    // Draw grass fields
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, height - 30, width, 30);

    // Sunshine orb
    ctx.fillStyle = "rgba(253, 224, 71, 0.8)";
    ctx.beginPath();
    ctx.arc(width - 40, 40, 12, 0, Math.PI * 2);
    ctx.fill();

    // Trees trunk & canopy blocks
    const treePositions = [50, 110, 260];
    treePositions.forEach((tx, index) => {
        // trunk
        ctx.fillStyle = "#78350f";
        ctx.fillRect(tx, height - 45, 6, 15);
        // canopy leaves block
        ctx.fillStyle = "#15803d";
        ctx.beginPath();
        ctx.arc(tx + 3, height - 50, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#166534";
        ctx.beginPath();
        ctx.arc(tx + 8, height - 54, 12, 0, Math.PI * 2);
        ctx.fill();
    });

    // Retro style park bench block
    ctx.fillStyle = "#b45309";
    ctx.fillRect(150, height - 25, 25, 4); // plank
    ctx.fillStyle = "#374151";
    ctx.fillRect(153, height - 21, 2, 6); // legs
    ctx.fillRect(170, height - 21, 2, 6);

    // Drifting falling pixel green leaves
    ctx.fillStyle = "#22c55e";
    leaves.forEach((l, idx) => {
        l.y += l.speed;
        l.x += Math.sin((frame + idx * 45) * 0.02) * 0.3;
        if (l.y > height) {
            l.y = -10;
            l.x = Math.random() * width;
        }
        ctx.fillRect(l.x, l.y, 2, 2);
    });
}

export function drawOfficeBoardroom(frame) {
    // Elegant tall blue/gray office look
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, width, height);

    // Shaded tall windows looking out to Silicon Valley
    ctx.fillStyle = "#1e293b";
    for (let w = 0; w < 4; w++) {
        ctx.fillRect(20 + w * 75, 10, 55, 100);
        
        // Drawing far tall buildings in the glass backdrops
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(25 + w * 75, 40, 25, 70);
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(35 + w * 75, 60, 25, 50);
    }

    // Boardroom conference table
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, 110, width, 70);
    ctx.fillStyle = "#7c3aed"; // Table bezel glow
    ctx.fillRect(0, 110, width, 4);

    // Active whiteboard rendering dynamic analytics graph
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(90, 20, 140, 70);
    ctx.fillStyle = "#64748b";
    ctx.fillRect(86, 16, 148, 4); // frame top

    // line chart going up (or fluctuating)
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(100, 75);
    ctx.lineTo(130, 65);
    ctx.lineTo(160, 70);
    ctx.lineTo(190, 45);
    // Dynamic animation dot going up
    const endY = 30 + Math.sin(frame * 0.1) * 10;
    ctx.lineTo(220, endY);
    ctx.stroke();

    // Render green "revenue" bar block columns on table
    ctx.fillStyle = "#10b981";
    ctx.fillRect(110, 45, 15, 20);
    ctx.fillRect(150, 50, 15, 15);
}

export function drawCoffeeCafe(frame) {
    // Warm brown ambient light
    ctx.fillStyle = "#27272a";
    ctx.fillRect(0, 0, width, height);

    // Brick background pattern
    ctx.fillStyle = "#18181b";
    for (let y = 0; y < 110; y += 12) {
        for (let x = (y % 24 === 0 ? 0 : 10); x < width; x += 30) {
            ctx.fillRect(x, y, 26, 10);
        }
    }

    // Wooden Counter Top bar
    ctx.fillStyle = "#3f2d20";
    ctx.fillRect(0, 115, width, 65);
    ctx.fillStyle = "#5c402d";
    ctx.fillRect(0, 115, width, 5);

    // Cozy Edison bulb with glowing radial yellow vectors
    const pulse = 1 + Math.sin(frame * 0.08) * 0.15;
    ctx.fillStyle = `rgba(251, 191, 36, ${0.1 * pulse})`;
    ctx.beginPath();
    ctx.arc(160, 20, 35 * pulse, 0, Math.PI * 2);
    ctx.fill();

    // bulb socket wire
    ctx.fillStyle = "#09090b";
    ctx.fillRect(159, 0, 2, 20);
    ctx.fillStyle = "#f59e0b";
    ctx.beginPath();
    ctx.arc(160, 22, 4, 0, Math.PI * 2);
    ctx.fill();

    // Steaming espresso engine machine
    ctx.fillStyle = "#71717a";
    ctx.fillRect(40, 75, 45, 40);
    ctx.fillStyle = "#a1a1aa";
    ctx.fillRect(45, 80, 20, 15);

    // Wavy steam lines rising
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(50 + Math.sin(frame * 0.1) * 1.5, 60 - (frame % 12), 1.5, 5);
    ctx.fillRect(57 - Math.sin(frame * 0.1) * 1.5, 63 - ((frame + 4) % 12), 1.5, 5);

    // Warm mugs of coffee sitting on counter
    ctx.fillStyle = "#d97706";
    ctx.fillRect(180, 103, 12, 12);
    ctx.fillRect(174, 106, 6, 2);
}

export function drawHingePhone(frame) {
    // Bright retro neon pink backdrop
    ctx.fillStyle = "#ec4899";
    ctx.fillRect(0, 0, width, height);

    // Perspective diagonal vectors matching dating theme
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2;
    for (let i = 0; i < width + 100; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i - 80, height);
        ctx.stroke();
    }

    // Draw Tall Smartphone mock frame
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(110, 10, 100, height - 20);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(116, 18, 88, height - 36);

    // Cute pixel card profile face inside display
    ctx.fillStyle = "#475569";
    ctx.fillRect(124, 28, 72, 60);

    // Animated Swiping card sliding right/left effect
    const slideOffset = Math.sin(frame * 0.04) * 35;
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(132 + slideOffset, 34, 56, 48);

    // Face drawing inside card
    ctx.fillStyle = "#fbcfe8";
    ctx.fillRect(146 + slideOffset, 42, 28, 28); // skin
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(144 + slideOffset, 38, 32, 12); // brown hair
    ctx.fillRect(151 + slideOffset, 48, 3, 3); // eyes
    ctx.fillRect(162 + slideOffset, 48, 3, 3); // eyes

    // Floating pink pixel hearts popping
    if (frame % 25 === 0) {
        particles.push({
            x: 130 + Math.random() * 60,
            y: height - 40,
            life: 25,
            speed: random.uniform(1.0, 1.8)
        });
    }

    ctx.fillStyle = "#f43f5e";
    particles.forEach(p => {
        p.y -= p.speed;
        p.life--;
        // Draw tiny 8-bit heart shape
        ctx.fillRect(p.x, p.y, 4, 4);
        ctx.fillRect(p.x - 2, p.y - 2, 3, 2);
        ctx.fillRect(p.x + 3, p.y - 2, 3, 2);
    });
    particles = particles.filter(p => p.life > 0);
}

export function drawDefaultVectorGrid(frame) {
    ctx.fillStyle = "#030712";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#eab308";
    ctx.lineWidth = 1;
    const center = width / 2;
    const horizon = 60;

    // Retro futuristic synth vector horizon lines
    for (let i = horizon; i < height; i += 12) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    for (let rx = -50; rx < width + 100; rx += 30) {
        ctx.beginPath();
        ctx.moveTo(center, horizon);
        ctx.lineTo(rx, height);
        ctx.stroke();
    }

    // Blinking computer terminal text
    ctx.fillStyle = "#eab308";
    ctx.fillRect(center - 60, 20, 120, 25);
    ctx.fillStyle = "#000000";
    ctx.fillRect(center - 58, 22, 116, 21);

    ctx.fillStyle = "#22c55e";
    if (Math.floor(frame / 12) % 2 === 0) {
        ctx.fillRect(center - 45, 28, 8, 8);
    }
}

// --- GAME OPERATIONS ENGINE & API HANDLER ---

// Display compile/progress loaders

// ---- new backdrops for the expanded content ----

export function drawEstate(frame) {
  // Sky handled by gradient; draw a hedge-lined Atherton mansion + pool.
  ctx.fillStyle = '#14532d'; ctx.fillRect(0, 120, width, 60);            // lawn
  ctx.fillStyle = '#166534'; for (let i = 0; i < width; i += 16) ctx.fillRect(i, 112, 12, 14); // hedge row
  ctx.fillStyle = '#7f1d1d'; ctx.fillRect(70, 60, 180, 60);             // brick mansion
  ctx.fillStyle = '#991b1b'; for (let r = 0; r < 3; r++) for (let c = 0; c < 9; c++) ctx.fillRect(74 + c * 20, 64 + r * 18, 16, 14);
  ctx.fillStyle = '#1f2937'; ctx.beginPath(); ctx.moveTo(60, 60); ctx.lineTo(160, 30); ctx.lineTo(260, 60); ctx.closePath(); ctx.fill(); // roof
  ctx.fillStyle = '#fcd34d'; ctx.fillRect(150, 90, 20, 30);            // lit door
  // pool shimmer
  ctx.fillStyle = '#0ea5e9'; ctx.fillRect(20, 138, 60, 26);
  const sh = Math.sin(frame * 0.1) * 3;
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(26 + sh, 144, 48, 2);
}

export function drawYacht(frame) {
  ctx.fillStyle = '#0c4a6e'; ctx.fillRect(0, 120, width, 60);          // sea
  for (let i = 0; i < 4; i++) { const y = 128 + i * 10; const x = (frame * (0.5 + i * 0.2)) % width;
    ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.fillRect(x - 20, y, 16, 2); ctx.fillRect((x + 80) % width, y + 3, 16, 2); }
  // hull
  ctx.fillStyle = '#f1f5f9'; ctx.beginPath(); ctx.moveTo(60, 118); ctx.lineTo(260, 118); ctx.lineTo(235, 140); ctx.lineTo(85, 140); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e2e8f0'; ctx.fillRect(95, 92, 120, 26);           // cabin deck
  ctx.fillStyle = '#38bdf8'; for (let w = 0; w < 5; w++) ctx.fillRect(102 + w * 22, 98, 14, 12); // windows
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(120, 70, 70, 22);
  ctx.fillStyle = '#fcd34d'; const bob = Math.sin(frame * 0.08) * 1.5; ctx.fillRect(150, 60 + bob, 6, 14); // mast light
}

export function drawIpo(frame) {
  ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, width, height);
  // Times Square towers with scrolling tickers
  ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#1f2937'; ctx.fillRect(10, 20, 90, 160); ctx.fillRect(120, 0, 80, 180); ctx.fillRect(215, 30, 95, 150);
  // big green ticker board
  ctx.fillStyle = '#022c22'; ctx.fillRect(120, 40, 80, 40);
  ctx.fillStyle = '#10b981'; ctx.font = '8px monospace';
  const tick = Math.floor(frame * 0.3) % 100; ctx.fillText('▲ ' + (400 + tick) + '%', 126, 64);
  // climbing candlesticks
  for (let i = 0; i < 8; i++) { const h = 6 + ((i * 7 + frame) % 30); ctx.fillStyle = '#34d399'; ctx.fillRect(20 + i * 9, 150 - h, 5, h); }
  // confetti
  for (let i = 0; i < 20; i++) { const x = (i * 37 + frame * 2) % width; const y = (i * 53 + frame * 3) % height; ctx.fillStyle = ['#f87171', '#fbbf24', '#34d399', '#60a5fa'][i % 4]; ctx.fillRect(x, y, 2, 2); }
  // golden bell
  ctx.fillStyle = '#fcd34d'; ctx.beginPath(); ctx.arc(250, 80, 14, Math.PI, 0); ctx.fill(); ctx.fillRect(236, 80, 28, 6);
}

export function drawHospital(frame) {
  ctx.fillStyle = '#e5e7eb'; ctx.fillRect(0, 0, width, height);       // sterile walls
  ctx.fillStyle = '#cbd5e1'; ctx.fillRect(0, 120, width, 60);        // floor
  // bed
  ctx.fillStyle = '#f8fafc'; ctx.fillRect(70, 100, 150, 40);
  ctx.fillStyle = '#94a3b8'; ctx.fillRect(70, 96, 150, 6);
  ctx.fillStyle = '#64748b'; ctx.fillRect(60, 90, 14, 50); ctx.fillRect(216, 90, 14, 50);
  // heart monitor
  ctx.fillStyle = '#0f172a'; ctx.fillRect(230, 40, 70, 44);
  ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 1.5; ctx.beginPath();
  const base = 64; ctx.moveTo(232, base);
  for (let x = 0; x < 66; x++) { const px = 232 + x; const beat = (x + frame) % 33; let py = base;
    if (beat === 14) py = base - 16; else if (beat === 16) py = base + 8; else if (beat === 18) py = base; ctx.lineTo(px, py); }
  ctx.stroke();
  // IV drip
  ctx.fillStyle = '#475569'; ctx.fillRect(40, 30, 3, 70);
  ctx.fillStyle = '#bae6fd'; ctx.fillRect(34, 30, 14, 20);
}

export function drawLibrary(frame) {
  ctx.fillStyle = '#3b2f2f'; ctx.fillRect(0, 0, width, height);      // warm wood
  // bookshelves
  for (let s = 0; s < 3; s++) { const y = 10 + s * 46; ctx.fillStyle = '#4b3621'; ctx.fillRect(0, y, width, 40);
    for (let b = 0; b < width; b += 7) { ctx.fillStyle = ['#7f1d1d', '#1e3a8a', '#14532d', '#92400e', '#3730a3'][(b + s) % 5]; ctx.fillRect(b + 1, y + 4, 5, 32); } }
  // green-shaded study lamp + desk
  ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 140, width, 40);
  ctx.fillStyle = '#064e3b'; ctx.beginPath(); ctx.moveTo(120, 120); ctx.lineTo(200, 120); ctx.lineTo(185, 134); ctx.lineTo(135, 134); ctx.closePath(); ctx.fill();
  const glow = 0.5 + Math.abs(Math.sin(frame * 0.05)) * 0.5;
  ctx.fillStyle = `rgba(250,204,21,${glow})`; ctx.fillRect(150, 134, 20, 6);
  // laptop glow
  ctx.fillStyle = '#0f172a'; ctx.fillRect(95, 150, 40, 22);
  ctx.fillStyle = '#22d3ee'; ctx.fillRect(99, 153, 32, 14);
}

export function drawTrail(frame) {
  ctx.fillStyle = '#365314'; ctx.fillRect(0, 110, width, 70);        // golden-green hills
  ctx.fillStyle = '#4d7c0f'; ctx.beginPath(); ctx.moveTo(0, 130); ctx.quadraticCurveTo(80, 90, 160, 120); ctx.quadraticCurveTo(240, 145, 320, 110); ctx.lineTo(320, 180); ctx.lineTo(0, 180); ctx.fill();
  ctx.fillStyle = '#a3a300'; ctx.beginPath(); ctx.moveTo(0, 150); ctx.quadraticCurveTo(120, 130, 320, 155); ctx.lineTo(320, 180); ctx.lineTo(0, 180); ctx.fill();
  // winding asphalt trail
  ctx.strokeStyle = '#52525b'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(150, 180); ctx.quadraticCurveTo(180, 150, 150, 130); ctx.quadraticCurveTo(120, 110, 160, 95); ctx.stroke();
  // the radio dish (Stanford Dish) on the ridge
  ctx.fillStyle = '#e5e7eb'; ctx.beginPath(); ctx.arc(250, 96, 12, Math.PI * 1.1, Math.PI * 2.1); ctx.fill();
  ctx.fillStyle = '#9ca3af'; ctx.fillRect(248, 96, 4, 16);
  // jogging runner
  const rx = 150 + Math.sin(frame * 0.06) * 4; const ry = 120 - Math.cos(frame * 0.12) * 2;
  ctx.fillStyle = '#0f172a'; ctx.fillRect(rx, ry, 4, 8); ctx.fillRect(rx - 2 + (frame % 8 < 4 ? 2 : -2), ry + 8, 3, 5);
}
