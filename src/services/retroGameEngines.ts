import { audioEngine } from './audioEngine';

export interface GameEngineState {
  tick: number;
  score: number;
  highScore: number;
  lives: number;
  health: number;
  maxHealth: number;
  level: number;
  playerX: number;
  playerY: number;
  playerZ: number;
  velX: number;
  velY: number;
  isAttacking: boolean;
  attackTimer: number;
  isDashing: boolean;
  dashTimer: number;
  isJumping: boolean;
  jumpTimer: number;
  bullets: Array<{ x: number; y: number; z?: number; vx: number; vy: number; color?: string; type?: string }>;
  enemies: Array<{ id: number; x: number; y: number; z?: number; hp: number; maxHp: number; type: string; vx: number; vy: number; anim: number }>;
  particles: Array<{ x: number; y: number; z?: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number }>;
  boss: { active: boolean; name: string; hp: number; maxHp: number; x: number; y: number; phase: number } | null;
  customData: Record<string, any>;
  combo: number;
  comboTimer: number;
}

export function createInitialState(gameId: string): GameEngineState {
  const base: GameEngineState = {
    tick: 0,
    score: 0,
    highScore: 50000,
    lives: 3,
    health: 100,
    maxHealth: 100,
    level: 1,
    playerX: 320,
    playerY: 240,
    playerZ: 0,
    velX: 0,
    velY: 0,
    isAttacking: false,
    attackTimer: 0,
    isDashing: false,
    dashTimer: 0,
    isJumping: false,
    jumpTimer: 0,
    bullets: [],
    enemies: [],
    particles: [],
    boss: null,
    customData: {},
    combo: 0,
    comboTimer: 0
  };

  if (gameId === 'chrono-blade-psx') {
    base.playerX = 300;
    base.playerY = 240;
    base.boss = { active: true, name: "Void Gorgon Lord", hp: 500, maxHp: 500, x: 500, y: 220, phase: 1 };
    base.enemies = [
      { id: 1, x: 200, y: 150, hp: 40, maxHp: 40, type: 'shadow_goblin', vx: 1, vy: 0, anim: 0 },
      { id: 2, x: 450, y: 320, hp: 60, maxHp: 60, type: 'dark_stalker', vx: -1, vy: 0, anim: 0 }
    ];
  } else if (gameId === 'star-striker-n64') {
    base.playerX = 320;
    base.playerY = 280;
    base.customData = { barrelRoll: 0, speed: 1.5, bombs: 3, ringCount: 0 };
    base.boss = { active: true, name: "Gorgon Dreadnought Core", hp: 800, maxHp: 800, x: 320, y: 120, phase: 1 };
  } else if (gameId === 'super-retro-kart') {
    base.playerX = 320;
    base.playerY = 360;
    base.customData = { speed: 0, maxSpeed: 14, angle: 0, lap: 1, maxLaps: 3, item: 'Mushroom Boost', lapTime: 0, bestLap: 74.2 };
    base.enemies = [
      { id: 1, x: 280, y: 320, hp: 100, maxHp: 100, type: 'rival_kart_red', vx: 0, vy: 0, anim: 0 },
      { id: 2, x: 360, y: 300, hp: 100, maxHp: 100, type: 'rival_kart_blue', vx: 0, vy: 0, anim: 0 }
    ];
  } else if (gameId === 'cyber-ninjas-nes') {
    base.playerX = 80;
    base.playerY = 320;
    base.customData = { ninjutsuPoints: 40, onGround: true, facingRight: true };
    base.enemies = [
      { id: 1, x: 300, y: 320, hp: 20, maxHp: 20, type: 'evil_samurai', vx: -1.5, vy: 0, anim: 0 },
      { id: 2, x: 500, y: 320, hp: 30, maxHp: 30, type: 'armored_demon', vx: -1, vy: 0, anim: 0 }
    ];
  } else if (gameId === 'emerald-monsters-gba') {
    base.playerX = 320;
    base.playerY = 240;
    base.customData = {
      inBattle: false,
      myMonster: { name: 'AetherZard', level: 25, hp: 92, maxHp: 92, exp: 45, maxExp: 100, type: 'Fire / Dragon' },
      enemyMonster: { name: 'Wild Zephyros', level: 24, hp: 85, maxHp: 85, type: 'Electric / Flying' },
      battleMenuIndex: 0,
      battleMessage: 'What will AetherZard do?'
    };
  } else if (gameId === 'sonic-surge-genesis') {
    base.playerX = 100;
    base.playerY = 320;
    base.customData = { rings: 24, speed: 0, isRolling: false, cameraOffset: 0 };
    base.enemies = [
      { id: 1, x: 400, y: 330, hp: 10, maxHp: 10, type: 'badnik_crab', vx: -1, vy: 0, anim: 0 },
      { id: 2, x: 750, y: 330, hp: 10, maxHp: 10, type: 'badnik_wasp', vx: 0, vy: 1, anim: 0 }
    ];
  } else if (gameId === 'neo-invaders-arcade') {
    base.playerX = 320;
    base.playerY = 420;
    base.customData = { wave: 1, ufoTimer: 300, bunkers: [120, 240, 380, 500] };
    base.enemies = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 8; c++) {
        base.enemies.push({
          id: r * 8 + c,
          x: 100 + c * 50,
          y: 60 + r * 35,
          hp: 1,
          maxHp: 1,
          type: r === 0 ? 'invader_top' : r < 2 ? 'invader_mid' : 'invader_bot',
          vx: 1,
          vy: 0,
          anim: 0
        });
      }
    }
  }

  return base;
}

// 1. PSX Chrono Blade 3D Render & Tick Engine
export function tickChronoBladePSX(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // Background 3D polygon dungeon grid
  ctx.fillStyle = '#0f0c1b';
  ctx.fillRect(0, 0, w, h);

  // Perspective floor grid
  ctx.strokeStyle = '#2d1b4e';
  ctx.lineWidth = 1.5;
  const horizon = h * 0.35;
  for (let x = -w; x < w * 2; x += 60) {
    ctx.beginPath();
    ctx.moveTo(w / 2 + (x - w / 2) * 0.1, horizon);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = horizon; y < h; y += (y - horizon + 15) * 0.4) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Player controls
  const speed = input.r1 ? 6.5 : 4.2;
  if (input.left) s.playerX -= speed;
  if (input.right) s.playerX += speed;
  if (input.up) s.playerY -= speed;
  if (input.down) s.playerY += speed;

  s.playerX = Math.max(40, Math.min(w - 40, s.playerX));
  s.playerY = Math.max(horizon + 20, Math.min(h - 40, s.playerY));

  // Attack Action (btnB = Slash, btnX = Magic Burst)
  if (input.btnB && !s.isAttacking) {
    s.isAttacking = true;
    s.attackTimer = 18;
    audioEngine.playLaser();
    s.combo++;
    s.comboTimer = 90;

    // Check hit against boss
    if (s.boss && Math.hypot(s.playerX - s.boss.x, s.playerY - s.boss.y) < 110) {
      s.boss.hp -= 25;
      s.score += 250;
      audioEngine.playHit();
      for (let p = 0; p < 8; p++) {
        s.particles.push({
          x: s.boss.x + (Math.random() * 40 - 20),
          y: s.boss.y + (Math.random() * 40 - 20),
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          life: 20,
          maxLife: 20,
          color: '#ff0055',
          size: 4
        });
      }
    }
  }

  if (s.attackTimer > 0) {
    s.attackTimer--;
    if (s.attackTimer === 0) s.isAttacking = false;
  }

  if (s.comboTimer > 0) {
    s.comboTimer--;
    if (s.comboTimer === 0) s.combo = 0;
  }

  // Draw 3D Boss (Void Gorgon Lord)
  if (s.boss && s.boss.hp > 0) {
    s.boss.x += Math.sin(s.tick * 0.03) * 2;
    s.boss.y += Math.cos(s.tick * 0.02) * 1.5;

    // Boss Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.ellipse(s.boss.x, s.boss.y + 35, 50, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Polygon faceted boss body (PlayStation style shaded triangles)
    const bx = s.boss.x;
    const by = s.boss.y;
    const pulse = Math.sin(s.tick * 0.1) * 4;

    // Torso poly
    ctx.fillStyle = '#6b1191';
    ctx.beginPath();
    ctx.moveTo(bx - 35, by - 20 + pulse);
    ctx.lineTo(bx + 35, by - 20 + pulse);
    ctx.lineTo(bx + 20, by + 30);
    ctx.lineTo(bx - 20, by + 30);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Polygon Head & Horns
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(bx, by - 55 + pulse);
    ctx.lineTo(bx + 25, by - 25 + pulse);
    ctx.lineTo(bx - 25, by - 25 + pulse);
    ctx.closePath();
    ctx.fill();

    // Boss glowing eyes
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(bx - 12, by - 35 + pulse, 6, 6);
    ctx.fillRect(bx + 6, by - 35 + pulse, 6, 6);

    // Boss Health Bar HUD
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(w / 2 - 150, 30, 300, 16);
    const hpPct = Math.max(0, s.boss.hp / s.boss.maxHp);
    ctx.fillStyle = hpPct > 0.3 ? '#ef4444' : '#fbbf24';
    ctx.fillRect(w / 2 - 148, 32, 296 * hpPct, 12);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(w / 2 - 150, 30, 300, 16);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${s.boss.name} [PSX Core]`, w / 2, 24);
  }

  // Draw Player Hero (32-Bit Low-Poly Knight)
  const px = s.playerX;
  const py = s.playerY;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(px, py + 18, 25, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polygon Knight Body
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.moveTo(px - 14, py - 10);
  ctx.lineTo(px + 14, py - 10);
  ctx.lineTo(px + 10, py + 15);
  ctx.lineTo(px - 10, py + 15);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#60a5fa';
  ctx.stroke();

  // Helmet
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(px - 10, py - 26, 20, 16);
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(px - 8, py - 20, 16, 4); // Visor

  // Sword Slash Effect
  if (s.isAttacking) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(px + 20, py, 35, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px + 35, py, 6, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Sheathed Blade
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px + 12, py + 10);
    ctx.lineTo(px + 24, py - 15);
    ctx.stroke();
  }

  // Render Particles
  s.particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  s.particles = s.particles.filter(p => p.life > 0);

  // HUD: PSX Status Overlay
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${s.score.toString().padStart(7, '0')}`, 20, 30);
  ctx.fillText(`HP: ${s.health}/${s.maxHealth}`, 20, 50);
  if (s.combo > 1) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 18px monospace';
    ctx.fillText(`${s.combo}x COMBO!`, 20, 80);
  }
}

// 2. N64 Star Striker 64 Render & Tick Engine
export function tickStarStrikerN64(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // Starfield 3D Depth
  ctx.fillStyle = '#030712';
  ctx.fillRect(0, 0, w, h);

  // Pseudo 3D moving stars
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 45; i++) {
    const starSpeed = ((i % 5) + 1) * 2;
    const sx = ((i * 47 + s.tick * starSpeed) % w);
    const sy = ((i * 93 + s.tick * (starSpeed * 0.5)) % h);
    const size = (i % 3) + 1;
    ctx.fillRect(sx, sy, size, size);
  }

  // Planetary Horizon (Z-Buffer Fog Style)
  const grad = ctx.createLinearGradient(0, h * 0.6, 0, h);
  grad.addColorStop(0, 'rgba(30, 58, 138, 0.4)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, h * 0.6, w, h * 0.4);

  // Player Arwing Movement
  if (input.left) s.playerX -= 5;
  if (input.right) s.playerX += 5;
  if (input.up) s.playerY -= 4.5;
  if (input.down) s.playerY += 4.5;

  s.playerX = Math.max(50, Math.min(w - 50, s.playerX));
  s.playerY = Math.max(50, Math.min(h - 60, s.playerY));

  // Lasers (btnA)
  if (input.btnA && s.tick % 8 === 0) {
    audioEngine.playLaser();
    s.bullets.push({ x: s.playerX - 16, y: s.playerY - 20, vx: 0, vy: -12, color: '#38bdf8' });
    s.bullets.push({ x: s.playerX + 16, y: s.playerY - 20, vx: 0, vy: -12, color: '#38bdf8' });
  }

  // Spawn Asteroids / Enemy Drones
  if (s.tick % 50 === 0) {
    s.enemies.push({
      id: Date.now() + Math.random(),
      x: Math.random() * (w - 100) + 50,
      y: -40,
      hp: 20,
      maxHp: 20,
      type: 'asteroid',
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 2 + 2,
      anim: 0
    });
  }

  // Update & Draw Bullets
  s.bullets.forEach(b => {
    b.y += b.vy;
    ctx.fillStyle = b.color || '#38bdf8';
    ctx.fillRect(b.x - 2, b.y, 4, 14);

    // Check hit against enemies
    s.enemies.forEach(e => {
      if (Math.hypot(b.x - e.x, b.y - e.y) < 30) {
        e.hp -= 15;
        b.y = -999;
        if (e.hp <= 0) {
          s.score += 150;
          audioEngine.playHit();
          for (let p = 0; p < 6; p++) {
            s.particles.push({
              x: e.x,
              y: e.y,
              vx: (Math.random() - 0.5) * 5,
              vy: (Math.random() - 0.5) * 5,
              life: 18,
              maxLife: 18,
              color: '#f59e0b',
              size: 3
            });
          }
        }
      }
    });
  });
  s.bullets = s.bullets.filter(b => b.y > 0);

  // Update & Draw Enemies / Asteroids
  s.enemies.forEach(e => {
    e.x += e.vx;
    e.y += e.vy;
    e.anim += 0.05;

    // Draw Low-Poly Asteroid
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(e.x, e.y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.stroke();
  });
  s.enemies = s.enemies.filter(e => e.y < h + 50 && e.hp > 0);

  // Draw 3D Arwing Ship (Low-Poly N64 Fighter)
  const px = s.playerX;
  const py = s.playerY;
  const roll = (input.left ? -0.3 : input.right ? 0.3 : 0);

  ctx.save();
  ctx.translate(px, py);
  ctx.rotate(roll);

  // Ship Fuselage
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(0, -32);
  ctx.lineTo(12, 16);
  ctx.lineTo(0, 10);
  ctx.lineTo(-12, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Wings (Low-Poly Swept Wings)
  ctx.fillStyle = '#0ea5e9';
  ctx.beginPath();
  ctx.moveTo(-10, 0);
  ctx.lineTo(-38, 20);
  ctx.lineTo(-28, 26);
  ctx.lineTo(-6, 12);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(38, 20);
  ctx.lineTo(28, 26);
  ctx.lineTo(6, 12);
  ctx.closePath();
  ctx.fill();

  // Cockpit canopy
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(-4, -16, 8, 12);

  // Engine Plasma Glow
  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(-4, 14, 8, 8 + Math.sin(s.tick * 0.5) * 4);

  ctx.restore();

  // Reticle / Crosshair
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(px, py - 90, 18, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeRect(px - 6, py - 96, 12, 12);

  // Render particles
  s.particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  });
  s.particles = s.particles.filter(p => p.life > 0);

  // HUD: N64 Shield & Bomb Meter
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`SCORE: ${s.score}`, 20, 30);
  ctx.fillText(`SHIELD: [||||||||]`, 20, 50);
  ctx.fillText(`NOVA BOMBS: 💣 x${s.customData?.bombs || 3}`, 20, 70);
}

// 3. SNES Super Retro Kart GP (Mode-7 Pseudo 3D Racer)
export function tickSuperRetroKartGP(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // Sky & Distant Mountain Parallax
  const horizon = h * 0.42;
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizon);
  skyGrad.addColorStop(0, '#1e3a8a');
  skyGrad.addColorStop(1, '#60a5fa');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, horizon);

  // Distant 16-bit Mountains
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  for (let m = 0; m <= w; m += 40) {
    const peak = horizon - 25 - Math.sin((m + s.customData.angle * 10) * 0.05) * 15;
    ctx.lineTo(m, peak);
  }
  ctx.lineTo(w, horizon);
  ctx.fill();

  // Mode-7 Road Rendering Loop
  const speed = s.customData.speed || 0;
  if (input.btnA) { // Accelerate
    s.customData.speed = Math.min(s.customData.maxSpeed, speed + 0.25);
    if (s.tick % 15 === 0) audioEngine.playEngineRev();
  } else {
    s.customData.speed = Math.max(0, speed - 0.15);
  }

  if (input.left) {
    s.customData.angle -= 0.04 * (speed / 10);
    s.playerX -= 3 * (speed / 10);
  }
  if (input.right) {
    s.customData.angle += 0.04 * (speed / 10);
    s.playerX += 3 * (speed / 10);
  }

  s.playerX = Math.max(w * 0.2, Math.min(w * 0.8, s.playerX));

  // Draw Mode-7 scanlines
  for (let y = horizon; y < h; y += 2) {
    const z = (y - horizon) / (h - horizon); // Depth 0 (horizon) to 1 (near)
    const segment = Math.floor((s.tick * speed + (1 / z) * 10) % 20);
    const isRed = segment > 10;
    
    // Grass
    ctx.fillStyle = isRed ? '#15803d' : '#16a34a';
    ctx.fillRect(0, y, w, 2);

    // Track road
    const roadWidth = w * 0.7 * z;
    const roadCenter = w / 2 + Math.sin(s.customData.angle) * (1 - z) * 80;

    // Road Curb
    ctx.fillStyle = isRed ? '#ef4444' : '#ffffff';
    ctx.fillRect(roadCenter - roadWidth / 2 - 12 * z, y, roadWidth + 24 * z, 2);

    // Asphalt
    ctx.fillStyle = isRed ? '#334155' : '#475569';
    ctx.fillRect(roadCenter - roadWidth / 2, y, roadWidth, 2);
  }

  // Player Kart (16-Bit Super Mario Kart Style Sprite)
  const px = s.playerX;
  const py = h - 65;

  // Drift Sparks
  if (input.r1 && speed > 5) {
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px - 18 + (Math.random() * 4), py + 15, 6, 6);
    ctx.fillRect(px + 12 + (Math.random() * 4), py + 15, 6, 6);
  }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.ellipse(px, py + 22, 28, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Kart Chassis
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px - 20, py, 40, 18);
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(px - 24, py + 6, 8, 16); // Left tire
  ctx.fillRect(px + 16, py + 6, 8, 16); // Right tire

  // Driver Helmet & Head
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(px, py - 8, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px - 8, py - 14, 16, 6); // Hat

  // HUD: Mode 7 Racer Stats
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`LAP: 2/3`, 20, 30);
  ctx.fillText(`TIME: 01:14.28`, 20, 55);
  ctx.fillText(`SPEED: ${(speed * 12).toFixed(0)} KM/H`, 20, 80);
  ctx.fillText(`ITEM: [🍄 BOOST]`, w - 180, 30);
}

// 4. NES Shadow Ninja Gaiden (8-Bit Action Platformer)
export function tickShadowNinjaGaidenNES(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // Classic NES Midnight Skyline
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // 8-bit Moon
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(w - 80, 80, 32, 0, Math.PI * 2);
  ctx.fill();

  // Rooftops & Platforms
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 340, w, h - 340);
  ctx.fillStyle = '#334155';
  ctx.fillRect(0, 336, w, 4); // Roof ledge

  // Elevated brick platform
  ctx.fillStyle = '#475569';
  ctx.fillRect(180, 240, 160, 20);
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(180, 236, 160, 4);

  // Player controls (8-bit physics)
  if (input.left) {
    s.playerX -= 3.5;
    s.customData.facingRight = false;
  }
  if (input.right) {
    s.playerX += 3.5;
    s.customData.facingRight = true;
  }

  // Jump (btnA)
  if (input.btnA && s.customData.onGround) {
    s.velY = -12;
    s.customData.onGround = false;
    audioEngine.playJump();
  }

  // Gravity
  s.velY += 0.8;
  s.playerY += s.velY;

  // Platform collision
  if (s.playerY >= 320) {
    s.playerY = 320;
    s.velY = 0;
    s.customData.onGround = true;
  } else if (s.playerY >= 220 && s.playerY <= 240 && s.playerX >= 160 && s.playerX <= 340 && s.velY > 0) {
    s.playerY = 220;
    s.velY = 0;
    s.customData.onGround = true;
  }

  // Ninja Katana Slash (btnB)
  if (input.btnB && !s.isAttacking) {
    s.isAttacking = true;
    s.attackTimer = 12;
    audioEngine.playLaser();
    s.score += 100;
  }
  if (s.attackTimer > 0) {
    s.attackTimer--;
    if (s.attackTimer === 0) s.isAttacking = false;
  }

  // Draw Enemies (Evil Samurai)
  s.enemies.forEach(e => {
    e.x += e.vx;
    if (e.x < 100 || e.x > w - 100) e.vx *= -1;

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(e.x - 10, 310, 20, 30);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(e.x - 6, 314, 12, 6); // Mask
  });

  // Draw Ryu Hayabusa Ninja Sprite (8-Bit Pixel Art)
  const px = s.playerX;
  const py = s.playerY;
  const right = s.customData.facingRight;

  // Blue Ninja Garb
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(px - 8, py - 20, 16, 20);
  
  // Ninja Headband & Mask
  ctx.fillStyle = '#1d4ed8';
  ctx.fillRect(px - 7, py - 30, 14, 10);
  ctx.fillStyle = '#fed7aa'; // Eyes skin
  ctx.fillRect(right ? px - 2 : px - 6, py - 26, 8, 3);
  ctx.fillStyle = '#ffffff'; // White headband tail
  ctx.fillRect(right ? px - 12 : px + 6, py - 28, 6, 4);

  // Katana Slash Arc
  if (s.isAttacking) {
    ctx.fillStyle = '#ffffff';
    const swordX = right ? px + 10 : px - 24;
    ctx.fillRect(swordX, py - 22, 18, 6);
  }

  // NES HUD Banner
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, 40);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 12px monospace';
  ctx.fillText(`SCORE: ${s.score.toString().padStart(6, '0')}`, 20, 24);
  ctx.fillText(`STAGE: 1-1`, 180, 24);
  ctx.fillText(`NINJUTSU: 40`, 300, 24);
  ctx.fillText(`LIVES: x3`, w - 100, 24);
}

// 5. GBA Aether Monsters Advance (Turn-Based Monster Adventure)
export function tickEmeraldMonstersGBA(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // 32-Bit GBA Palette Outdoor Town / Tall Grass
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(0, 0, w, h);

  // Cobblestone path
  ctx.fillStyle = '#d6d3d1';
  ctx.fillRect(w / 2 - 40, 0, 80, h);

  // Tall Grass Patches
  ctx.fillStyle = '#15803d';
  for (let gx = 40; gx < 220; gx += 28) {
    for (let gy = 40; gy < h - 40; gy += 28) {
      ctx.fillRect(gx, gy, 24, 24);
      ctx.fillStyle = '#166534';
      ctx.fillRect(gx + 4, gy + 4, 16, 16);
      ctx.fillStyle = '#15803d';
    }
  }

  // Player Movement
  if (input.left) s.playerX -= 3.5;
  if (input.right) s.playerX += 3.5;
  if (input.up) s.playerY -= 3.5;
  if (input.down) s.playerY += 3.5;

  // Draw GBA Trainer Sprite
  const px = s.playerX;
  const py = s.playerY;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(px, py + 8, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Trainer Red Jacket
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px - 7, py - 10, 14, 14);
  // Cap
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(px - 6, py - 20, 12, 10);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(px - 7, py - 22, 14, 4);

  // GBA Dialog Box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(20, h - 80, w - 40, 65);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, h - 80, w - 40, 65);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText("🌿 Wild grass area ahead! Press A to inspect.", 40, h - 42);
  ctx.fillStyle = '#64748b';
  ctx.font = '12px monospace';
  ctx.fillText("POKEMON AETHER ADVANCE • GBA CORE ACTIVE", 40, h - 22);
}

// 6. Genesis Sonic Cyber Surge
export function tickSonicCyberSurgeGenesis(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  
  // Genesis Blast Processing Checkered Horizon
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, w, h);

  // Parallax Green Hills
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 300, w, h - 300);

  // Checkerboard Ground
  for (let x = 0; x < w; x += 32) {
    for (let y = 300; y < h; y += 32) {
      const isAlt = (Math.floor(x / 32) + Math.floor(y / 32)) % 2 === 0;
      ctx.fillStyle = isAlt ? '#92400e' : '#b45309';
      ctx.fillRect(x, y, 32, 32);
    }
  }

  // Golden Rings
  for (let r = 0; r < 4; r++) {
    const rx = 240 + r * 50;
    const ry = 260;
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 12, 16 + Math.sin(s.tick * 0.2 + r) * 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Player Hedgehog Movement
  if (input.right) {
    s.playerX += 6;
    if (s.tick % 20 === 0) audioEngine.playJump();
  }
  if (input.left) s.playerX -= 6;
  s.playerX = Math.max(40, Math.min(w - 40, s.playerX));

  // Sonic Sprite
  const px = s.playerX;
  const py = 285;
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.arc(px, py, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444'; // Red shoes
  ctx.fillRect(px - 14, py + 12, 12, 6);
  ctx.fillRect(px + 2, py + 12, 12, 6);

  // Genesis HUD
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`RINGS: 24`, 20, 30);
  ctx.fillText(`TIME: 00:32`, 20, 55);
  ctx.fillText(`SCORE: 4850`, 20, 80);
}

// 7. Neo Space Invaders Arcade
export function tickNeoSpaceInvadersArcade(ctx: CanvasRenderingContext2D, s: GameEngineState, input: Record<string, boolean>, w: number, h: number) {
  s.tick++;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);

  if (input.left) s.playerX -= 4;
  if (input.right) s.playerX += 4;
  s.playerX = Math.max(30, Math.min(w - 30, s.playerX));

  if (input.btnA && s.tick % 15 === 0) {
    audioEngine.playLaser();
    s.bullets.push({ x: s.playerX, y: s.playerY - 20, vx: 0, vy: -10, color: '#22c55e' });
  }

  // Bullets
  s.bullets.forEach(b => {
    b.y += b.vy;
    ctx.fillStyle = b.color || '#22c55e';
    ctx.fillRect(b.x - 2, b.y, 4, 12);
  });
  s.bullets = s.bullets.filter(b => b.y > 0);

  // Aliens Grid
  s.enemies.forEach(e => {
    e.x += Math.sin(s.tick * 0.05) * 1.5;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(e.x - 12, e.y - 8, 24, 16);
    ctx.fillStyle = '#000000';
    ctx.fillRect(e.x - 6, e.y - 2, 4, 4);
    ctx.fillRect(e.x + 2, e.y - 2, 4, 4);
  });

  // Player Defense Cannon
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(s.playerX - 16, s.playerY, 32, 14);
  ctx.fillRect(s.playerX - 4, s.playerY - 8, 8, 8);

  // Arcade Score Banner
  ctx.fillStyle = '#ef4444';
  ctx.font = 'bold 16px monospace';
  ctx.fillText(`1UP: 02840`, 30, 28);
  ctx.fillStyle = '#22c55e';
  ctx.fillText(`HIGH-SCORE: 99840`, w / 2 - 80, 28);
}
