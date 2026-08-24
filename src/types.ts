export type ConsoleType = 'PSX' | 'N64' | 'GBA' | 'SNES' | 'NES' | 'GENESIS' | 'ARCADE';

export type DeviceMode = 'desktop' | 'phone' | 'tablet' | 'tv';

export type ThemeType = 'cyberpunk' | 'retro-crt' | 'vaporwave' | 'midnight-oled' | 'gameboy' | 'glacier';

export type ShaderFilter = 'none' | 'scanlines' | 'curved-crt' | 'phosphor-mask' | 'lcd-grid' | 'bloom-neon' | 'smooth-bilinear';

export interface GameMetadata {
  id: string;
  title: string;
  console: ConsoleType;
  genre: string;
  year: number;
  rating: number; // e.g. 4.9
  coverImage: string;
  heroBanner?: string;
  bannerImage?: string;
  description: string;
  developer?: string;
  publisher?: string;
  players?: string; // e.g. "1-4 Players (Co-Op)"
  playersCount?: number;
  fileSize?: string;
  isCustomRom?: boolean;
  romData?: ArrayBuffer | string;
  favorite?: boolean;
  hasCloudSave?: boolean;
  lastPlayedDate?: string;
  playtimeMinutes?: number;
  controlsGuide?: {
    dpad?: string;
    btnA?: string;
    btnB?: string;
    btnX?: string;
    btnY?: string;
    btnL?: string;
    btnR?: string;
    start?: string;
    select?: string;
  };
  defaultCheats?: {
    id: string;
    name: string;
    code: string;
    enabled: boolean;
    description: string;
  }[];
  achievements?: {
    id: string;
    title: string;
    description: string;
    points: number;
    unlocked: boolean;
    icon: string;
  }[];
  tags?: string[];
}

export interface SaveStateSlot {
  slot: number;
  name: string;
  timestamp: number;
  thumbnail: string;
  stateData: any;
  cloudSynced: boolean;
  deviceId: string;
  gameId: string;
  playtimeSeconds: number;
}

export interface GamepadMapping {
  dpadUp: string;
  dpadDown: string;
  dpadLeft: string;
  dpadRight: string;
  btnA: string;
  btnB: string;
  btnX: string;
  btnY: string;
  btnL1: string;
  btnR1: string;
  btnL2: string;
  btnR2: string;
  start: string;
  select: string;
  turboA: string;
  turboB: string;
  rewind: string;
  fastForward: string;
  deadzone: number;
  vibrationEnabled: boolean;
}

export interface PerformanceMetrics {
  fps: number;
  targetFps: number;
  frameTimeMs: number;
  audioLatencyMs: number;
  memoryMb: number;
  cpuLoadPct: number;
  inputLagMs: number;
  droppedFrames: number;
  resolution: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  gamerTag?: string;
  level: number;
  xp: number;
  totalPlaytimeMinutes: number;
  trophiesCount: number;
  cloudSavesCount: number;
  connectedDevices: {
    id: string;
    name: string;
    type: 'desktop' | 'phone' | 'tablet' | 'tv';
    lastSynced: string;
    current: boolean;
  }[];
  favoriteGames?: string[];
}

export interface LeaderboardItem {
  id: string;
  gameId: string;
  gameTitle: string;
  console: string;
  username: string;
  avatar: string;
  score: number;
  timeFormatted: string;
  platform: string;
  verified: boolean;
  date: string;
}

export interface MultiplayerPlayer {
  id: string;
  name: string;
  avatar: string;
  playerIndex: number;
  ready: boolean;
  isHost: boolean;
  latency: number;
  isTalking?: boolean;
}

export interface MultiplayerRoomState {
  id: string;
  gameId: string;
  gameTitle: string;
  console: string;
  hostName: string;
  hostAvatar: string;
  maxPlayers: number;
  currentPlayers: MultiplayerPlayer[];
  spectators: { id: string; name: string }[];
  isPrivate: boolean;
  code: string;
  status: 'waiting' | 'playing';
  createdAt: number;
}
