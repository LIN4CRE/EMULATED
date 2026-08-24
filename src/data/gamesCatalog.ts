import { GameMetadata } from '../types';

export const INITIAL_GAMES_CATALOG: GameMetadata[] = [
  {
    id: 'chrono-blade-psx',
    title: 'Chrono Blade 3D',
    console: 'PSX',
    genre: '3D Action RPG / Hack & Slash',
    year: 1998,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'A masterpiece 32-bit PlayStation polygon action RPG. Journey through the shattered timeline of Aethelgard with combo blade slashes, spatial magic bursts, and epic polygon 3D boss encounters.',
    developer: 'SquareNova Studios',
    players: '1-2 Players (Co-Op Duel)',
    fileSize: '342 MB',
    controlsGuide: {
      dpad: 'Move Hero & 3D Aim',
      btnA: 'Cross (Jump / Roll)',
      btnB: 'Circle (Blade Slash)',
      btnX: 'Square (Magic Burst)',
      btnY: 'Triangle (Guard Shield)',
      btnL: 'L1 Target Lock',
      btnR: 'R1 Dash Evade',
      start: 'Pause / Quest Menu',
      select: 'Map & Inventory'
    },
    defaultCheats: [
      { id: 'c1', name: 'Infinite Mana (Action Replay)', code: '80081C40 03E7', enabled: false, description: 'Never run out of Chrono Aether mana' },
      { id: 'c2', name: 'Legendary Sword Unlocked', code: '80081C44 0001', enabled: true, description: 'Start with the Excalibur Chrono Blade' },
      { id: 'c3', name: 'Double Attack Power', code: '80081C50 0002', enabled: false, description: 'Deals 200% physical & spell damage' }
    ],
    achievements: [
      { id: 'ach-1', title: 'First Chrono Slash', description: 'Defeat your first dungeon beast in real-time combat', points: 50, unlocked: true, icon: 'Sword' },
      { id: 'ach-2', title: 'Time Lord Slayer', description: 'Defeat the Obsidian Void Dragon without taking hit', points: 150, unlocked: false, icon: 'Flame' },
      { id: 'ach-3', title: 'Speedrunner of Aethelgard', description: 'Clear Dungeon Floor 1 under 3 minutes', points: 100, unlocked: false, icon: 'Timer' }
    ],
    tags: ['PlayStation', '3D Poly', 'RPG', 'Boss Fight', 'PSX Classic']
  },
  {
    id: 'star-striker-n64',
    title: 'Star Striker 64',
    console: 'N64',
    genre: '3D Sci-Fi Rail Shooter',
    year: 1997,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    description: 'Pilot the legendary Arwing-inspired FX-900 interceptor through high-speed orbital asteroid rings, low-poly enemy dreadnoughts, and planetary bases with authentic N64 Z-buffer fog.',
    developer: 'Nintendo / Argonautic',
    players: '1-4 Players (Battle Royale)',
    fileSize: '16.8 MB',
    controlsGuide: {
      dpad: 'N64 Analog 3D Flight',
      btnA: 'A Button (Twin Lasers)',
      btnB: 'B Button (Nova Bomb)',
      btnX: 'C-Up (Cockpit View)',
      btnY: 'C-Down (Somersault)',
      btnL: 'Z-Trigger (Barrel Roll Left)',
      btnR: 'R-Trigger (Barrel Roll Right)',
      start: 'Pause Mission',
      select: 'Target Radar Toggle'
    },
    defaultCheats: [
      { id: 'c4', name: 'Infinite Nova Bombs', code: '81078B30 0009', enabled: true, description: 'Unlimited screen-clearing plasma bombs' },
      { id: 'c5', name: 'Hyper Shield Invincibility', code: '81078B32 00FF', enabled: false, description: 'Immune to laser collisions and asteroid impacts' }
    ],
    achievements: [
      { id: 'ach-4', title: 'Barrel Roll Master', description: 'Perform 10 evasive barrel rolls in a single stage', points: 50, unlocked: true, icon: 'Shield' },
      { id: 'ach-5', title: 'Mothership Down', description: 'Destroy Sector 7 Mothership Core', points: 120, unlocked: false, icon: 'Crosshair' }
    ],
    tags: ['N64', '3D Shooter', 'Sci-Fi', '64-bit', 'Multiplayer']
  },
  {
    id: 'emerald-monsters-gba',
    title: 'Aether Monsters Advance',
    console: 'GBA',
    genre: 'Turn-Based Creature RPG',
    year: 2002,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Explore the vibrant tropical archipelago of Zephyria. Catch, train, and battle 150+ elemental creatures in lush 32-bit GBA pixel art with weather effects and gym tournaments.',
    developer: 'GameFreak Inspired',
    players: '1-2 Players (Link Cable Netplay)',
    fileSize: '8.2 MB',
    controlsGuide: {
      dpad: 'Walk / Run / Bike',
      btnA: 'A Button (Confirm / Talk)',
      btnB: 'B Button (Cancel / Running Shoes)',
      btnX: 'L Shoulder (Quick Bag)',
      btnY: 'R Shoulder (Pokedex)',
      btnL: 'L Shoulder Trigger',
      btnR: 'R Shoulder Trigger',
      start: 'Game Menu',
      select: 'Registered Item'
    },
    defaultCheats: [
      { id: 'c6', name: 'Infinite Master Orbs', code: '82003884 0001', enabled: true, description: 'Catch any wild monster with 100% success rate' },
      { id: 'c7', name: 'Max EXP Multiplier', code: '820241F0 270F', enabled: false, description: 'Gain 10x experience points per victory' }
    ],
    achievements: [
      { id: 'ach-6', title: 'First Companion', description: 'Choose your starter elemental creature', points: 30, unlocked: true, icon: 'Sparkles' },
      { id: 'ach-7', title: 'League Champion', description: 'Defeat all 8 Gym Leaders and the Elite Grandmaster', points: 200, unlocked: false, icon: 'Trophy' }
    ],
    tags: ['GBA', 'Creature RPG', 'Pixel Art', 'Game Boy Advance', 'Portable']
  },
  {
    id: 'super-retro-kart',
    title: 'Super Retro Kart GP',
    console: 'SNES',
    genre: 'Mode-7 Pseudo 3D Racing',
    year: 1994,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    description: 'Iconic 16-bit Mode-7 texture mapping kart racer with boost pads, banana peels, red lightning rockets, tight drift corners, and split-screen 2-player multiplayer.',
    developer: 'Kyoto Speed Lab',
    players: '1-4 Players (Split Screen / Online)',
    fileSize: '4.1 MB',
    controlsGuide: {
      dpad: 'Steer Left / Right',
      btnA: 'B Button (Accelerate Gas)',
      btnB: 'A Button (Use Item / Rocket)',
      btnX: 'Y Button (Brake / Reverse)',
      btnY: 'X Button (Rear View Mirror)',
      btnL: 'L Trigger (Hop / Power Drift)',
      btnR: 'R Trigger (Power Slide / Drift)',
      start: 'Pause Race',
      select: 'Change Camera'
    },
    defaultCheats: [
      { id: 'c8', name: 'Infinite Turbo Mushroom', code: '7E0E20 03', enabled: false, description: 'Constant maximum rocket acceleration' },
      { id: 'c9', name: 'All 150cc Cups Unlocked', code: '7E0E22 01', enabled: true, description: 'Unlock Special Cup & Rainbow Speedway' }
    ],
    achievements: [
      { id: 'ach-8', title: 'Gold Cup Laurels', description: 'Win 1st Place in Mushroom GP 100cc', points: 60, unlocked: true, icon: 'Trophy' },
      { id: 'ach-9', title: 'Sub-Minute Ghost', description: 'Complete Rainbow Speedway in under 01:15', points: 150, unlocked: false, icon: 'Zap' }
    ],
    tags: ['SNES', 'Mode-7', 'Racing', 'Multiplayer', '16-bit']
  },
  {
    id: 'cyber-ninjas-nes',
    title: 'Shadow Ninja Gaiden',
    console: 'NES',
    genre: '8-Bit Action Platformer',
    year: 1989,
    rating: 4.7,
    coverImage: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Fast-paced, razor-sharp 8-bit NES ninja platforming with wall-climbing, shuriken arts, precision sword strikes, dramatic cinematic cutscenes, and blazing chiptunes.',
    developer: 'Tecmo Classic Tribute',
    players: '1 Player',
    fileSize: '512 KB',
    controlsGuide: {
      dpad: 'Move & Duck & Wall Cling',
      btnA: 'A Button (Jump / Wall Kick)',
      btnB: 'B Button (Dragon Sword Slash)',
      btnX: 'Up + B (Ninjutsu Arts / Fire Wheel)',
      start: 'Start Game / Pause',
      select: 'Select Ninjutsu Tool'
    },
    defaultCheats: [
      { id: 'c10', name: 'Infinite Lives (99)', code: '00A2:63', enabled: true, description: 'Unlimited ninja respawns' },
      { id: 'c11', name: 'Infinite Ninjutsu Spirit Points', code: '00A3:63', enabled: false, description: 'Cast infinite Fire Wheels and Shurikens' }
    ],
    achievements: [
      { id: 'ach-10', title: 'Shadow Walker', description: 'Clear Act 1 without losing a life', points: 50, unlocked: true, icon: 'Target' },
      { id: 'ach-11', title: 'Demon Mask Defeated', description: 'Slay the Ancient Jaquio Demon King', points: 200, unlocked: false, icon: 'Skull' }
    ],
    tags: ['NES', '8-bit', 'Ninja', 'Platformer', 'Retro Hard']
  },
  {
    id: 'sonic-surge-genesis',
    title: 'Sonic Cyber Surge',
    console: 'GENESIS',
    genre: '16-Bit High-Speed Blast Platformer',
    year: 1993,
    rating: 4.8,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    description: 'Blistering 60fps blast-processing physics platformer with giant loops, magnetic shield powers, bouncy springs, robotic badniks, and stereo FM synthesis audio.',
    developer: 'Sega MegaDev Lab',
    players: '1-2 Players (Sonic & Tails Co-Op)',
    fileSize: '3.2 MB',
    controlsGuide: {
      dpad: 'Run & Spin Dash (Down+Jump)',
      btnA: 'A Button (Jump / Spin Attack)',
      btnB: 'B Button (Jump)',
      btnX: 'C Button (Jump)',
      start: 'Pause Game',
      select: 'Insta-Shield Pulse'
    },
    defaultCheats: [
      { id: 'c12', name: 'Super Sonic From Start', code: 'FFFF28:01', enabled: false, description: 'Transform into golden Super Sonic instantly' },
      { id: 'c13', name: 'Infinite Golden Rings', code: 'FFFE20:03E7', enabled: true, description: 'Hold 999 rings for invulnerability' }
    ],
    achievements: [
      { id: 'ach-12', title: 'Sound Barrier Broken', description: 'Reach top speed on Neon Highway loop', points: 40, unlocked: true, icon: 'Zap' },
      { id: 'ach-13', title: 'Chaos Emerald Master', description: 'Collect all 7 Chaos Emeralds in Special Stage', points: 180, unlocked: false, icon: 'Gem' }
    ],
    tags: ['Genesis', 'Mega Drive', 'Blast Processing', 'Sonic', 'Fast']
  },
  {
    id: 'neo-invaders-arcade',
    title: 'Neo Space Invaders Arcade',
    console: 'ARCADE',
    genre: 'Coin-Op Sci-Fi Arcade Classic',
    year: 1984,
    rating: 4.6,
    coverImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Defend earth against descending alien armadas in authentic cabinet scanlines, destructive bunker shields, UFO mystery ships, and combo multipliers.',
    developer: 'Taito / NeoGeo Arcade Corp',
    players: '1-2 Players (Alternating High Score)',
    fileSize: '1.5 MB',
    controlsGuide: {
      dpad: 'Move Defense Cannon Left / Right',
      btnA: 'Button 1 (Plasma Laser Cannon)',
      btnB: 'Button 2 (Shield Barrier EMP)',
      start: 'Insert Coin / 1P Start',
      select: 'Insert 25¢ Coin'
    },
    defaultCheats: [
      { id: 'c14', name: 'Infinite Defensive Cannons', code: 'ARC_INF_CANNON', enabled: true, description: 'Never lose a ship during waves' },
      { id: 'c15', name: 'Rapid Fire Burst', code: 'ARC_RAPID_FIRE', enabled: true, description: 'Shoot 3 simultaneous lasers' }
    ],
    achievements: [
      { id: 'ach-14', title: 'UFO Hunter', description: 'Shoot down 5 mystery flying saucers in one wave', points: 80, unlocked: true, icon: 'Radar' },
      { id: 'ach-15', title: '1,000,000 High Score', description: 'Reach legendary arcade high score master rank', points: 250, unlocked: false, icon: 'Crown' }
    ],
    tags: ['Arcade', 'NeoGeo', 'Coin-Op', 'Retro Shooter', 'Cabinet']
  }
];

export const DEFAULT_GAMES_CATALOG = INITIAL_GAMES_CATALOG.map(g => ({
  ...g,
  heroBanner: g.bannerImage || g.coverImage,
  publisher: g.developer || 'Retro Studio',
  playersCount: g.players?.includes('4') ? 4 : g.players?.includes('2') ? 2 : 1,
  favorite: false,
  hasCloudSave: true,
  lastPlayedDate: 'Recently',
  playtimeMinutes: Math.floor(Math.random() * 120) + 15
}));
