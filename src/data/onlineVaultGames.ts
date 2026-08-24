import { GameMetadata } from '../types';

export interface VaultGameItem extends GameMetadata {
  downloadUrl: string;
  romFileName: string;
  isPreinstalledInLibrary?: boolean;
  downloadsCount: number;
}

export const ONLINE_RETRO_VAULT: VaultGameItem[] = [
  {
    id: 'vault-psx-castlevania',
    title: 'Castlevania: Symphony of Night',
    console: 'PSX',
    genre: 'Gothic Metroidvania Action RPG',
    year: 1997,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Enter Dracula’s shape-shifting castle as Alucard. Wield hundred of swords, shields, familiars, and dark metamorphosis magic spells with legendary 32-bit CD-ROM audio.',
    developer: 'Konami Tokyo',
    publisher: 'Konami',
    players: '1 Player',
    playersCount: 1,
    fileSize: '412.5 MB',
    downloadsCount: 142800,
    downloadUrl: 'https://archive.org/download/retro-psx-vault/Castlevania_SOTN_USA.chd',
    romFileName: 'Castlevania_SOTN.chd',
    tags: ['Metroidvania', 'PlayStation 1', 'Alucard', 'Action RPG', 'Masterpiece'],
    controlsGuide: {
      dpad: 'Move / Crouch / Dash',
      btnA: 'Cross (Jump / Double Jump)',
      btnB: 'Circle (Right Hand Weapon)',
      btnX: 'Square (Left Hand Weapon / Shield)',
      btnY: 'Triangle (Backdash)',
      btnL: 'L1 Bat / Wolf Morph',
      btnR: 'R1 Mist Morph',
      start: 'Inventory & Equip Menu',
      select: 'Castle Map Grid'
    },
    defaultCheats: [
      { id: 'cv1', name: 'Alucard Crissaegrim Sword', code: '80097BA8 0056', enabled: true, description: 'Spawns the quadruple-slice wind sword' },
      { id: 'cv2', name: 'Infinite MP / Hearts', code: '80097BA0 03E7', enabled: false, description: 'Unlimited magic and relic heart reserves' }
    ],
    achievements: [
      { id: 'cv-ach-1', title: 'What is a Man?', description: 'Defeat Dracula in the prologue Richter battle', points: 100, unlocked: true, icon: 'Flame' },
      { id: 'cv-ach-2', title: 'Inverted Castle Master', description: 'Flip the castle and uncover 200.6% map completion', points: 200, unlocked: false, icon: 'Shield' }
    ]
  },
  {
    id: 'vault-n64-mario64',
    title: 'Super Mario 64: Star Road',
    console: 'N64',
    genre: '3D Platformer Adventure',
    year: 1996,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    description: 'The revolutionary 3D platformer featuring fluid triple jumps, wing cap glides, ground pounds, and 120 Power Stars across Peach’s painting-filled castle worlds.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    players: '1 Player',
    playersCount: 1,
    fileSize: '8.4 MB',
    downloadsCount: 231500,
    downloadUrl: 'https://archive.org/download/retro-n64-vault/Super_Mario_64_USA.z64',
    romFileName: 'Super_Mario_64.z64',
    tags: ['Nintendo 64', '3D Platformer', 'Mario', 'Classic', 'Ultra 64'],
    controlsGuide: {
      dpad: 'Analog 3D Movement',
      btnA: 'A Button (Jump / Swim)',
      btnB: 'B Button (Punch / Dive / Kick)',
      btnX: 'C-Up (First Person Camera)',
      btnY: 'C-Down (Zoom Out Camera)',
      btnL: 'Z-Trigger (Crouch / Ground Pound)',
      btnR: 'R-Trigger (Camera Angle Lock)',
      start: 'Pause Menu / Star Checklist',
      select: 'Map Overview'
    },
    defaultCheats: [
      { id: 'm1', name: 'Infinite Wing Cap Duration', code: '8133B21E 0FFF', enabled: true, description: 'Fly perpetually with the winged red cap' },
      { id: 'm2', name: 'Moon Jump (Hold A)', code: 'D033AFA0 0020', enabled: false, description: 'Defy gravity when holding A' }
    ],
    achievements: [
      { id: 'm-ach-1', title: 'King Bob-omb Defeated', description: 'Throw King Bob-omb off the mountain peak', points: 50, unlocked: true, icon: 'Crown' },
      { id: 'm-ach-2', title: '120 Power Stars', description: 'Collect all 120 stars and meet Yoshi on the roof', points: 250, unlocked: false, icon: 'Star' }
    ]
  },
  {
    id: 'vault-n64-zelda-oot',
    title: 'The Legend of Zelda: Ocarina of Time',
    console: 'N64',
    genre: '3D Action-Adventure Masterpiece',
    year: 1998,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Travel through time using the Master Sword and the Ocarina of Time. Explore the vast fields of Hyrule, solve temple dungeons with Z-targeting lock-on combat.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    players: '1 Player',
    playersCount: 1,
    fileSize: '32.0 MB',
    downloadsCount: 198000,
    downloadUrl: 'https://archive.org/download/retro-n64-vault/Legend_of_Zelda_Ocarina_of_Time_USA.z64',
    romFileName: 'Zelda_Ocarina_Of_Time.z64',
    tags: ['Zelda', 'Hyrule', 'N64', 'Action RPG', 'Masterpiece'],
    controlsGuide: {
      dpad: 'Analog Hero Movement',
      btnA: 'A Button (Action / Roll / Talk)',
      btnB: 'B Button (Master Sword Slash)',
      btnX: 'C-Left (Assigned Item)',
      btnY: 'C-Right (Assigned Item)',
      btnL: 'Z-Targeting (Lock-on Combat)',
      btnR: 'R Shield Guard',
      start: 'Inventory & Gear Screen',
      select: 'Ocarina Songs & Spiritual Stones'
    },
    defaultCheats: [
      { id: 'z1', name: 'Infinite Magic Meter', code: '8011A605 0001', enabled: true, description: 'Unlimited magic for Din’s Fire and Lens of Truth' },
      { id: 'z2', name: 'Infinite 999 Rupees', code: '8011A604 03E7', enabled: true, description: 'Max giant wallet capacity filled with rupees' }
    ],
    achievements: [
      { id: 'z-ach-1', title: 'Awakening the Hero', description: 'Draw the Master Sword from the Temple of Time pedestal', points: 100, unlocked: true, icon: 'Sword' },
      { id: 'z-ach-2', title: 'Water Temple Conquered', description: 'Clear the Water Temple and obtain the Longshot', points: 150, unlocked: false, icon: 'Shield' }
    ]
  },
  {
    id: 'vault-gba-metroid-fusion',
    title: 'Metroid Fusion: Sector Zero',
    console: 'GBA',
    genre: 'Sci-Fi Action Adventure',
    year: 2002,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Samus Aran investigates the quarantined BSL orbital research station infested with parasitic X organisms and the relentless stalking SA-X mimic.',
    developer: 'Nintendo R&D1',
    publisher: 'Nintendo',
    players: '1 Player',
    playersCount: 1,
    fileSize: '8.0 MB',
    downloadsCount: 112400,
    downloadUrl: 'https://archive.org/download/retro-gba-vault/Metroid_Fusion_USA.gba',
    romFileName: 'Metroid_Fusion.gba',
    tags: ['Metroid', 'GBA', 'Samus', 'Sci-Fi', 'Metroidvania'],
    controlsGuide: {
      dpad: 'Run / Aim 45 Degrees / Morph Ball',
      btnA: 'A Button (Jump / Space Jump)',
      btnB: 'B Button (Power Beam / Missiles)',
      btnX: 'L Trigger (Diagonal Aim Up)',
      btnY: 'R Trigger (Hold for Missile Arm)',
      btnL: 'L Shoulder (Aim Up)',
      btnR: 'R Shoulder (Missile Select)',
      start: 'BSL Station Map & Navigation',
      select: 'Status & Suit Upgrades'
    },
    defaultCheats: [
      { id: 'mf1', name: 'Infinite Missiles', code: '0203875E 03E7', enabled: true, description: 'Unlimited Super Missiles & Diffusion' },
      { id: 'mf2', name: 'Invincibility Suit', code: '02038758 03E7', enabled: false, description: 'Immune to SA-X and X parasite damage' }
    ],
    achievements: [
      { id: 'mf-ach-1', title: 'SA-X Evader', description: 'Survive the first terrifying chase with SA-X in Sector 2', points: 80, unlocked: true, icon: 'Shield' },
      { id: 'mf-ach-2', title: 'Omega Metroid Down', description: 'Defeat the Omega Metroid with Ice Beam restored', points: 150, unlocked: false, icon: 'Crosshair' }
    ]
  },
  {
    id: 'vault-gba-pokemon-emerald',
    title: 'Pokemon Emerald: Complete Edition',
    console: 'GBA',
    genre: 'Monster Tamer RPG',
    year: 2004,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'Embark through the Hoenn region, halt the climate clashes of Team Magma and Aqua, awaken legendary Rayquaza, and conquer the Battle Frontier.',
    developer: 'Game Freak',
    publisher: 'The Pokemon Company / Nintendo',
    players: '1-2 Players (Link Cable Netplay)',
    playersCount: 2,
    fileSize: '16.0 MB',
    downloadsCount: 389000,
    downloadUrl: 'https://archive.org/download/retro-gba-vault/Pokemon_Emerald_USA.gba',
    romFileName: 'Pokemon_Emerald.gba',
    tags: ['Pokemon', 'GBA', 'RPG', 'Turn-Based', 'Rayquaza'],
    controlsGuide: {
      dpad: 'Walk / Run / Mach Bike',
      btnA: 'A Button (Talk / Select)',
      btnB: 'B Button (Running Shoes / Cancel)',
      btnX: 'L Trigger (Quick Help)',
      btnY: 'R Trigger (Pokedex)',
      btnL: 'L Trigger',
      btnR: 'R Trigger',
      start: 'Trainer Menu',
      select: 'Registered Item Key'
    },
    defaultCheats: [
      { id: 'pe1', name: '100% Catch Rate Master Ball in PC', code: '82025840 0001', enabled: true, description: 'Unlimited Master Balls in withdraw PC' },
      { id: 'pe2', name: 'Fast Hatch Eggs (1 Step)', code: '02028824 0001', enabled: false, description: 'Instantly hatch any Pokemon egg in party' }
    ],
    achievements: [
      { id: 'pe-ach-1', title: 'Sky Pillar Climber', description: 'Ascend Sky Pillar with Mach Bike and meet Rayquaza', points: 120, unlocked: true, icon: 'Flame' },
      { id: 'pe-ach-2', title: 'Battle Frontier Gold Symbol', description: 'Defeat Brandon at Battle Pyramid for gold symbol', points: 250, unlocked: false, icon: 'Trophy' }
    ]
  },
  {
    id: 'vault-snes-super-mario-world',
    title: 'Super Mario World: Dinosaur Land',
    console: 'SNES',
    genre: '16-Bit Platformer Masterpiece',
    year: 1990,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    description: 'Ride Yoshi, spin jump over obstacles, soar with the Cape Feather, and find secret keyhole exits across 96 exits in Dinosaur Land.',
    developer: 'Nintendo EAD',
    publisher: 'Nintendo',
    players: '1-2 Players (Alternating)',
    playersCount: 2,
    fileSize: '1.0 MB',
    downloadsCount: 298000,
    downloadUrl: 'https://archive.org/download/retro-snes-vault/Super_Mario_World_USA.sfc',
    romFileName: 'Super_Mario_World.sfc',
    tags: ['SNES', 'Platformer', 'Mario', 'Yoshi', '16-bit'],
    controlsGuide: {
      dpad: 'Run / Crouch / Look Up',
      btnA: 'A Button (Spin Jump)',
      btnB: 'B Button (Standard Jump / Float)',
      btnX: 'X Button (Run / Hold Shell / Fireball)',
      btnY: 'Y Button (Run / Dash)',
      btnL: 'L Shoulder (Scroll Screen Left)',
      btnR: 'R Shoulder (Scroll Screen Right)',
      start: 'Pause Game',
      select: 'Drop Item Box Powerup'
    },
    defaultCheats: [
      { id: 'smw1', name: 'Infinite Lives (99)', code: '7E0DBE63', enabled: true, description: 'Start and retain 99 lives' },
      { id: 'smw2', name: 'Always Cape Mario', code: '7E001902', enabled: false, description: 'Retain cape flying power at all times' }
    ],
    achievements: [
      { id: 'smw-ach-1', title: 'Star Road Unlocked', description: 'Discover the secret road in the sky', points: 80, unlocked: true, icon: 'Star' },
      { id: 'smw-ach-2', title: '96 Exits Cleared', description: 'Complete every secret keyhole exit in the game', points: 200, unlocked: false, icon: 'Trophy' }
    ]
  },
  {
    id: 'vault-snes-chrono-trigger',
    title: 'Chrono Trigger: Flames of Eternity',
    console: 'SNES',
    genre: 'Time-Travel Turn-Based RPG',
    year: 1995,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Created by the Dream Team (Hironobu Sakaguchi, Yuji Horii, Akira Toriyama). Travel from 65,000,000 BC to 2300 AD to prevent the apocalypse of Lavos.',
    developer: 'Square',
    publisher: 'Square',
    players: '1 Player',
    playersCount: 1,
    fileSize: '4.0 MB',
    downloadsCount: 187000,
    downloadUrl: 'https://archive.org/download/retro-snes-vault/Chrono_Trigger_USA.sfc',
    romFileName: 'Chrono_Trigger.sfc',
    tags: ['Chrono Trigger', 'SNES', 'Square', 'Time Travel', 'RPG Masterpiece'],
    controlsGuide: {
      dpad: 'Move Hero in Map & Battle',
      btnA: 'A Button (Confirm / Tech Attack)',
      btnB: 'B Button (Cancel / Dash)',
      btnX: 'X Button (Main Menu / Gear)',
      btnY: 'Y Button (Switch Active Character)',
      btnL: 'L Shoulder (Escape Battle)',
      btnR: 'R Shoulder (Escape Battle)',
      start: 'Pause',
      select: 'Epoch Wings Toggle'
    },
    defaultCheats: [
      { id: 'ct1', name: 'Max Gold (999,999G)', code: '7E02C43F 7E02C542', enabled: true, description: 'Unlimited money across all eras' },
      { id: 'ct2', name: 'Infinite Tech Points (TP)', code: '7E02B8FF', enabled: false, description: 'Learn all dual and triple tech combos immediately' }
    ],
    achievements: [
      { id: 'ct-ach-1', title: 'The Wings of Time', description: 'Acquire the Epoch time-travelling flying vessel', points: 100, unlocked: true, icon: 'Flame' },
      { id: 'ct-ach-2', title: 'Defeater of Lavos', description: 'Slay Lavos at the End of Time and see the Golden Ending', points: 250, unlocked: false, icon: 'Crown' }
    ]
  },
  {
    id: 'vault-genesis-sonic2',
    title: 'Sonic the Hedgehog 2 HD',
    console: 'GENESIS',
    genre: 'High-Speed 16-Bit Platformer',
    year: 1992,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    description: 'Blast through Chemical Plant and Emerald Hill with Sonic and Tails. Master the iconic Spin Dash, collect all 7 Chaos Emeralds, and transform into Super Sonic.',
    developer: 'Sega Technical Institute',
    publisher: 'Sega',
    players: '1-2 Players (Split Screen Co-Op)',
    playersCount: 2,
    fileSize: '1.0 MB',
    downloadsCount: 245000,
    downloadUrl: 'https://archive.org/download/retro-genesis-vault/Sonic_The_Hedgehog_2_USA.md',
    romFileName: 'Sonic_The_Hedgehog_2.md',
    tags: ['Sonic', 'Genesis', 'Mega Drive', 'Sega', 'High Speed'],
    controlsGuide: {
      dpad: 'Run Left/Right, Crouch (Spin Dash)',
      btnA: 'A Button (Jump / Spin Dash Rev)',
      btnB: 'B Button (Jump)',
      btnX: 'X Button (Tails Fly Co-Op)',
      btnY: 'Y Button (Super Sonic Transform)',
      btnL: 'Mode Select',
      btnR: 'Mode Select',
      start: 'Pause',
      select: 'Sound Test Code Menu'
    },
    defaultCheats: [
      { id: 's2_1', name: 'Start with 7 Chaos Emeralds', code: 'FFFFB007', enabled: true, description: 'Transform into Super Sonic with 50 rings' },
      { id: 's2_2', name: 'Level Select Enabled (19-65-09-17)', code: 'FFFFD001', enabled: true, description: 'Choose any zone directly from title screen' }
    ],
    achievements: [
      { id: 's2-ach-1', title: 'Chemical Plant Speedster', description: 'Clear Chemical Plant Act 1 in under 35 seconds', points: 80, unlocked: true, icon: 'Timer' },
      { id: 's2-ach-2', title: 'Super Sonic Unleashed', description: 'Collect 50 rings and soar at mach speed as Super Sonic', points: 150, unlocked: false, icon: 'Zap' }
    ]
  },
  {
    id: 'vault-genesis-streets-of-rage2',
    title: 'Streets of Rage 2: Syndicate Riot',
    console: 'GENESIS',
    genre: 'Side-Scrolling Beat ’Em Up',
    year: 1992,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80',
    description: 'The pinnacle of 16-bit brawlers with legendary Yuzo Koshiro club soundtrack. Play as Axel, Blaze, Skate, or Max to take down Mr. X’s crime syndicate.',
    developer: 'Ancient / Sega',
    publisher: 'Sega',
    players: '1-2 Players (Co-Op Brawler)',
    playersCount: 2,
    fileSize: '2.0 MB',
    downloadsCount: 165000,
    downloadUrl: 'https://archive.org/download/retro-genesis-vault/Streets_of_Rage_2_USA.md',
    romFileName: 'Streets_of_Rage_2.md',
    tags: ['Beat Em Up', 'Genesis', 'Yuzo Koshiro', 'Co-Op', 'Classic'],
    controlsGuide: {
      dpad: 'Move 8 Directions',
      btnA: 'A Button (Special Blitz Attack)',
      btnB: 'B Button (Punch / Kick Combo)',
      btnX: 'X Button (Grand Upper)',
      btnY: 'Y Button (Jump Kick)',
      btnL: 'Hold for Weapon Throw',
      btnR: 'Hold for Weapon Throw',
      start: 'Pause Game',
      select: 'Options / Stage Select'
    },
    defaultCheats: [
      { id: 'sor1', name: 'Infinite Health (No Special Drain)', code: 'FFEF5500', enabled: true, description: 'Special moves do not consume health' },
      { id: 'sor2', name: '9 Lives per Player', code: 'FFEF5609', enabled: true, description: 'Start with 9 extra credits' }
    ],
    achievements: [
      { id: 'sor-ach-1', title: 'Grand Upper Legend', description: 'Perform a 10-hit combo on Zamza with Axel', points: 60, unlocked: true, icon: 'Sword' },
      { id: 'sor-ach-2', title: 'Mr. X Dethroned', description: 'Defeat Mr. X in the Syndicate Penthouse on Mania difficulty', points: 200, unlocked: false, icon: 'Crown' }
    ]
  },
  {
    id: 'vault-nes-super-mario3',
    title: 'Super Mario Bros 3: Star World',
    console: 'NES',
    genre: '8-Bit Platformer Classic',
    year: 1988,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    description: 'Travel through 8 varied worlds with world maps, Tanooki suit, Frog suit, Hammer suit, Goomba’s shoe, and airship battles against Bowser’s Koopalings.',
    developer: 'Nintendo R&D4',
    publisher: 'Nintendo',
    players: '1-2 Players (Co-Op Alternating)',
    playersCount: 2,
    fileSize: '384 KB',
    downloadsCount: 320000,
    downloadUrl: 'https://archive.org/download/retro-nes-vault/Super_Mario_Bros_3_USA.nes',
    romFileName: 'Super_Mario_Bros_3.nes',
    tags: ['NES', '8-Bit', 'Mario', 'Platformer', 'Tanooki'],
    controlsGuide: {
      dpad: 'Move / Crouch / Slide Down Slope',
      btnA: 'A Button (Jump / Flutter Fly)',
      btnB: 'B Button (Run / Tail Whip / Fireball)',
      btnX: 'B Button Turbo',
      btnY: 'A Button Turbo',
      btnL: 'Inventory',
      btnR: 'Inventory',
      start: 'Pause / Enter Stage',
      select: 'Open Inventory Card Deck'
    },
    defaultCheats: [
      { id: 'smb3_1', name: 'Infinite P-Wing Flight Time', code: '0552:FF', enabled: true, description: 'Fly indefinitely in any stage' },
      { id: 'smb3_2', name: 'Start with 3 Magic Warp Whistles', code: '0738:03', enabled: true, description: 'Skip directly to World 8 Dark Land' }
    ],
    achievements: [
      { id: 'smb3-ach-1', title: 'Tanooki Statue Master', description: 'Transform into stone statue to crush an enemy', points: 50, unlocked: true, icon: 'Shield' },
      { id: 'smb3-ach-2', title: 'Dark Land Airship Cleared', description: 'Defeat Bowser in Castle 8', points: 150, unlocked: false, icon: 'Crown' }
    ]
  },
  {
    id: 'vault-nes-mega-man-2',
    title: 'Mega Man 2: Hyper Blue Bomber',
    console: 'NES',
    genre: '8-Bit Action Platformer',
    year: 1988,
    rating: 4.9,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'Defeat Dr. Wily’s 8 Robot Masters (Metal Man, Quick Man, Air Man, Bubble Man) and steal their weapons with unforgettable 8-bit chiptune melodies.',
    developer: 'Capcom',
    publisher: 'Capcom',
    players: '1 Player',
    playersCount: 1,
    fileSize: '256 KB',
    downloadsCount: 178000,
    downloadUrl: 'https://archive.org/download/retro-nes-vault/Mega_Man_2_USA.nes',
    romFileName: 'Mega_Man_2.nes',
    tags: ['Mega Man', 'NES', 'Capcom', 'Action Platformer', 'Chiptune'],
    controlsGuide: {
      dpad: 'Move Left/Right, Climb Ladders',
      btnA: 'A Button (Jump)',
      btnB: 'B Button (Mega Buster / Metal Blade)',
      btnX: 'B Button Turbo Rapid-Fire',
      btnY: 'A Button Turbo',
      btnL: 'Item 1 Platform',
      btnR: 'Item 2 Jet',
      start: 'Weapon Selection Menu',
      select: 'E-Tank Use'
    },
    defaultCheats: [
      { id: 'mm2_1', name: 'Infinite Metal Blade Ammo', code: '009E:1C', enabled: true, description: 'Unlimited 8-directional Metal Blades' },
      { id: 'mm2_2', name: 'Infinite E-Tanks (4 Tanks)', code: '00A7:04', enabled: true, description: 'Full health restoration reserves' }
    ],
    achievements: [
      { id: 'mm2-ach-1', title: 'Quick Man Without Flash Stopper', description: 'Defeat Quick Man using only standard Mega Buster', points: 100, unlocked: false, icon: 'Zap' },
      { id: 'mm2-ach-2', title: 'Wily Machine Wrecked', description: 'Conquer the Wily Castle Alien Hologram', points: 150, unlocked: false, icon: 'Crown' }
    ]
  },
  {
    id: 'vault-arcade-metal-slug-x',
    title: 'Metal Slug X: Super Vehicle 001',
    console: 'ARCADE',
    genre: 'Run & Gun Coin-Op Arcade',
    year: 1999,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    description: 'The golden standard of Neo-Geo arcade action. Blast through enemy military forces, alien invaders, and giant mechanical bosses with SV-001 tanks and camel slug cannons.',
    developer: 'SNK',
    publisher: 'SNK Neo-Geo',
    players: '1-2 Players (Co-Op Arcade)',
    playersCount: 2,
    fileSize: '38.5 MB',
    downloadsCount: 275000,
    downloadUrl: 'https://archive.org/download/retro-arcade-vault/mslugx_neogeo.zip',
    romFileName: 'mslugx_neogeo.zip',
    tags: ['Neo-Geo', 'Arcade', 'Run and Gun', 'SNK', 'Co-Op'],
    controlsGuide: {
      dpad: '8-Way Aim & Move, Crouch',
      btnA: 'A Button (Heavy Machine Gun / Shotgun)',
      btnB: 'B Button (Jump)',
      btnX: 'C Button (Grenades / Bomb Throw)',
      btnY: 'D Button (Slug Vehicle Exit / Self-Destruct)',
      btnL: 'Coin Insert (Credit+)',
      btnR: '1P/2P Start',
      start: 'Arcade Player 1 Start',
      select: 'Insert Virtual Coin Credit'
    },
    defaultCheats: [
      { id: 'msx1', name: 'Infinite Heavy Machine Gun Ammo', code: '100432:9999', enabled: true, description: 'Unlimited heavy machine gun bullets' },
      { id: 'msx2', name: 'Infinite Grenades', code: '100434:0099', enabled: true, description: '99 screen-clearing pineapples and molotovs' }
    ],
    achievements: [
      { id: 'msx-ach-1', title: 'Mission 1 Cleared: Iron Nokana', description: 'Destroy the iron juggernaut boss with zero deaths', points: 70, unlocked: true, icon: 'Flame' },
      { id: 'msx-ach-2', title: 'Alien Mothership Down', description: 'Defeat the Mars People mothership core', points: 200, unlocked: false, icon: 'Crosshair' }
    ]
  },
  {
    id: 'vault-arcade-street-fighter-2',
    title: 'Street Fighter II: Champion Edition',
    console: 'ARCADE',
    genre: 'Competitive 2D Fighting Game',
    year: 1992,
    rating: 5.0,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
    description: 'The arcade phenomenon that defined the fighting genre. Play as Ryu, Ken, Chun-Li, Guile, and the 4 Grand Masters (Balrog, Vega, Sagat, M. Bison) with 6-button precision.',
    developer: 'Capcom CPS-1',
    publisher: 'Capcom',
    players: '1-2 Players (Head-to-Head Duel)',
    playersCount: 2,
    fileSize: '12.0 MB',
    downloadsCount: 310000,
    downloadUrl: 'https://archive.org/download/retro-arcade-vault/sf2ce_arcade.zip',
    romFileName: 'sf2ce_arcade.zip',
    tags: ['Street Fighter', 'Arcade', 'CPS1', 'Fighting', 'Capcom'],
    controlsGuide: {
      dpad: '8-Way Movement, Block, Crouch',
      btnA: 'Light Punch (Jab)',
      btnB: 'Medium Punch (Strong)',
      btnX: 'Heavy Punch (Fierce)',
      btnY: 'Light Kick (Short)',
      btnL: 'Medium Kick (Forward)',
      btnR: 'Heavy Kick (Roundhouse)',
      start: '1P Start',
      select: 'Insert Arcade Coin'
    },
    defaultCheats: [
      { id: 'sf2_1', name: 'Infinite Time Limit', code: 'FF8650:0099', enabled: true, description: 'No 99-second round timer countdown' },
      { id: 'sf2_2', name: 'Always Full Super Meter', code: 'FF8652:00FF', enabled: false, description: 'Instantly execute Super Combos' }
    ],
    achievements: [
      { id: 'sf2-ach-1', title: 'Hadouken Master', description: 'Land 5 consecutive Hadouken fireballs in a single round', points: 50, unlocked: true, icon: 'Flame' },
      { id: 'sf2-ach-2', title: 'World Warrior Champion', description: 'Defeat M. Bison in Thailand and view character ending', points: 150, unlocked: false, icon: 'Trophy' }
    ]
  }
];
