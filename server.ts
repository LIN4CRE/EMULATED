import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// In-memory persistent state stores for multiplayer rooms, leaderboards, cloud saves
interface LeaderboardEntry {
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

interface CloudSaveSlot {
  id: string;
  userId: string;
  gameId: string;
  slotNumber: number;
  name: string;
  timestamp: number;
  thumbnail?: string;
  stateData: string;
  device: string;
  playtimeSeconds: number;
}

interface MultiplayerRoom {
  id: string;
  gameId: string;
  gameTitle: string;
  console: string;
  hostName: string;
  hostAvatar: string;
  maxPlayers: number;
  currentPlayers: { id: string; name: string; avatar: string; playerIndex: number; ready: boolean; isHost: boolean; latency: number }[];
  spectators: { id: string; name: string }[];
  isPrivate: boolean;
  code: string;
  status: "waiting" | "playing";
  createdAt: number;
}

let leaderboards: LeaderboardEntry[] = [
  {
    id: "lb-1",
    gameId: "chrono-blade-psx",
    gameTitle: "Chrono Blade 3D",
    console: "PSX",
    username: "RetroValkyrie",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80",
    score: 984500,
    timeFormatted: "14:32.18",
    platform: "Desktop PC",
    verified: true,
    date: "2026-08-24"
  },
  {
    id: "lb-2",
    gameId: "star-striker-n64",
    gameTitle: "Star Striker 64",
    console: "N64",
    username: "FoxNova",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    score: 875000,
    timeFormatted: "18:45.02",
    platform: "Android TV",
    verified: true,
    date: "2026-08-24"
  },
  {
    id: "lb-3",
    gameId: "emerald-monsters-gba",
    gameTitle: "Aether Monsters Advance",
    console: "GBA",
    username: "PixelNinja_99",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    score: 760200,
    timeFormatted: "22:10.55",
    platform: "Phone",
    verified: true,
    date: "2026-08-23"
  },
  {
    id: "lb-4",
    gameId: "super-retro-kart",
    gameTitle: "Super Retro Kart GP",
    console: "SNES",
    username: "DriftKing_X",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    score: 698100,
    timeFormatted: "01:24.49",
    platform: "Tablet",
    verified: true,
    date: "2026-08-24"
  },
  {
    id: "lb-5",
    gameId: "cyber-ninjas-nes",
    gameTitle: "Shadow Ninja Gaiden",
    console: "NES",
    username: "CyberSamurai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    score: 640900,
    timeFormatted: "09:55.10",
    platform: "Desktop PC",
    verified: true,
    date: "2026-08-22"
  }
];

let cloudSaves: CloudSaveSlot[] = [];
let multiplayerRooms: MultiplayerRoom[] = [
  {
    id: "room-retro-101",
    gameId: "super-retro-kart",
    gameTitle: "Super Retro Kart GP",
    console: "SNES",
    hostName: "SpeedyGonz",
    hostAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    maxPlayers: 4,
    currentPlayers: [
      { id: "p1", name: "SpeedyGonz", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80", playerIndex: 0, ready: true, isHost: true, latency: 18 },
      { id: "p2", name: "ApexRacer", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=120&auto=format&fit=crop&q=80", playerIndex: 1, ready: true, isHost: false, latency: 24 }
    ],
    spectators: [{ id: "s1", name: "Watcher_9" }],
    isPrivate: false,
    code: "KART64",
    status: "playing",
    createdAt: Date.now() - 300000
  },
  {
    id: "room-retro-102",
    gameId: "chrono-blade-psx",
    gameTitle: "Chrono Blade 3D",
    console: "PSX",
    hostName: "Valkyrie",
    hostAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    maxPlayers: 2,
    currentPlayers: [
      { id: "p1", name: "Valkyrie", avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80", playerIndex: 0, ready: true, isHost: true, latency: 12 }
    ],
    spectators: [],
    isPrivate: false,
    code: "BLADE1",
    status: "waiting",
    createdAt: Date.now() - 120000
  }
];

// Lazy initialize Gemini client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ----------------- API ROUTES ----------------- //

// Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: Date.now(), cloudStatus: "online", activeRooms: multiplayerRooms.length });
});

// Gemini AI Retro Game Guide & Strategy Assistant
app.post("/api/gemini/game-guide", async (req, res) => {
  try {
    const { gameTitle, consoleName, query, gameStateContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback smart offline response
      return res.json({
        success: true,
        answer: `[Offline Guide Mode] For **${gameTitle || "Retro Classic"}** (${consoleName || "Console"}):\n\n- **Boss Strategy**: Watch enemy attack patterns; dodge right before the animation peak.\n- **Secret Tips**: Look for destructible wall textures and hidden chime clues.\n- **Speedrun Skip**: Utilize frame-perfect jump momentum cancel on steep slopes.`,
        suggestedCheats: [
          { code: "01FF16D0", desc: "Infinite Health / Invulnerability" },
          { code: "010928CF", desc: "Max Score Multiplier 99x" },
          { code: "010045DC", desc: "Unlock All Secret Stages & Characters" }
        ]
      });
    }

    const prompt = `You are the legendary AetherCloud Retro Gaming AI Master & Guide. 
The player is currently playing: "${gameTitle}" on the ${consoleName} system.
Game state context: ${gameStateContext || "In-game session"}
Player query: "${query}"

Provide a concise, highly engaging, authentic retro-gaming response with:
1. Direct tactical advice / secret walkthrough step
2. Pro-speedrunner frame trick or hidden easter egg
3. 2-3 genuine or accurately formatted Action Replay / GameShark / Game Genie cheat codes relevant to the title.
Keep formatting clean with bullet points and bold highlights.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert retro video game strategist, speedrunner, and archivist specializing in PSX, N64, GBA, SNES, NES, and Genesis titles."
      }
    });

    res.json({
      success: true,
      answer: response.text
    });
  } catch (error: any) {
    console.error("Gemini Guide Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate guide response" });
  }
});

// Leaderboards API
app.get("/api/leaderboards", (req, res) => {
  const { gameId, consoleName } = req.query;
  let filtered = [...leaderboards];
  if (gameId) {
    filtered = filtered.filter(l => l.gameId === gameId);
  }
  if (consoleName && consoleName !== "ALL") {
    filtered = filtered.filter(l => l.console.toLowerCase() === String(consoleName).toLowerCase());
  }
  // Sort by score desc
  filtered.sort((a, b) => b.score - a.score);
  res.json({ success: true, leaderboards: filtered });
});

app.post("/api/leaderboards/submit", (req, res) => {
  const { gameId, gameTitle, consoleName, username, avatar, score, timeFormatted, platform } = req.body;
  if (!username || score === undefined) {
    return res.status(400).json({ error: "Missing required leaderboard fields" });
  }

  const newEntry: LeaderboardEntry = {
    id: `lb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    gameId: gameId || "custom-rom",
    gameTitle: gameTitle || "Retro Classic",
    console: consoleName || "GBA",
    username,
    avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    score: Number(score),
    timeFormatted: timeFormatted || "02:15.00",
    platform: platform || "Desktop PC",
    verified: true,
    date: new Date().toISOString().split("T")[0]
  };

  leaderboards.unshift(newEntry);
  res.json({ success: true, entry: newEntry });
});

// Cloud Saves API
app.get("/api/sync/saves", (req, res) => {
  const { userId, gameId } = req.query;
  let userSaves = cloudSaves.filter(s => s.userId === (userId || "default-user"));
  if (gameId) {
    userSaves = userSaves.filter(s => s.gameId === gameId);
  }
  res.json({ success: true, saves: userSaves });
});

app.post("/api/sync/saves", (req, res) => {
  const { userId, gameId, slotNumber, name, thumbnail, stateData, device, playtimeSeconds } = req.body;
  
  // Update or insert slot
  const index = cloudSaves.findIndex(s => 
    s.userId === (userId || "default-user") && 
    s.gameId === gameId && 
    s.slotNumber === slotNumber
  );

  const newSave: CloudSaveSlot = {
    id: `save-${gameId}-${slotNumber}-${Date.now()}`,
    userId: userId || "default-user",
    gameId,
    slotNumber: slotNumber || 1,
    name: name || `Slot ${slotNumber || 1}`,
    timestamp: Date.now(),
    thumbnail,
    stateData: stateData || "{}",
    device: device || "Web Player",
    playtimeSeconds: playtimeSeconds || 0
  };

  if (index >= 0) {
    cloudSaves[index] = newSave;
  } else {
    cloudSaves.push(newSave);
  }

  res.json({ success: true, save: newSave, totalCloudSlots: cloudSaves.length });
});

// Multiplayer Co-Op Rooms API
app.get("/api/rooms", (req, res) => {
  res.json({ success: true, rooms: multiplayerRooms });
});

app.post("/api/rooms/create", (req, res) => {
  const { gameId, gameTitle, consoleName, hostName, hostAvatar, maxPlayers, isPrivate } = req.body;
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const newRoom: MultiplayerRoom = {
    id: `room-${Date.now()}`,
    gameId: gameId || "super-retro-kart",
    gameTitle: gameTitle || "Super Retro Kart GP",
    console: consoleName || "SNES",
    hostName: hostName || "Player 1",
    hostAvatar: hostAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
    maxPlayers: maxPlayers || 4,
    currentPlayers: [
      {
        id: `host-${Date.now()}`,
        name: hostName || "Player 1",
        avatar: hostAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        playerIndex: 0,
        ready: true,
        isHost: true,
        latency: 14
      }
    ],
    spectators: [],
    isPrivate: !!isPrivate,
    code,
    status: "waiting",
    createdAt: Date.now()
  };

  multiplayerRooms.unshift(newRoom);
  res.json({ success: true, room: newRoom });
});

app.post("/api/rooms/join", (req, res) => {
  const { roomId, roomCode, playerName, playerAvatar, asSpectator } = req.body;
  const room = multiplayerRooms.find(r => r.id === roomId || (roomCode && r.code === roomCode.toUpperCase()));

  if (!room) {
    return res.status(404).json({ error: "Room not found with that ID or Code" });
  }

  if (asSpectator) {
    const spectator = { id: `spec-${Date.now()}`, name: playerName || "Spectator" };
    room.spectators.push(spectator);
    return res.json({ success: true, role: "spectator", room });
  }

  if (room.currentPlayers.length >= room.maxPlayers) {
    return res.status(400).json({ error: "Room is full" });
  }

  const newPlayer = {
    id: `player-${Date.now()}`,
    name: playerName || `Player ${room.currentPlayers.length + 1}`,
    avatar: playerAvatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
    playerIndex: room.currentPlayers.length,
    ready: true,
    isHost: false,
    latency: Math.floor(Math.random() * 15) + 12
  };

  room.currentPlayers.push(newPlayer);
  if (room.currentPlayers.length >= 2) {
    room.status = "playing";
  }

  res.json({ success: true, role: "player", player: newPlayer, room });
});

// Vite middleware & Static Assets Handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AetherCloud Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
