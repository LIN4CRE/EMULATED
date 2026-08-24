import { SaveStateSlot, UserProfile } from '../types';

class CloudSyncService {
  private currentUserId: string = 'user-retro-main';
  private dbPromise: Promise<IDBDatabase> | null = null;

  constructor() {
    this.initDB();
  }

  private initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open('aethercloud_retro_db', 2);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('saves')) {
          db.createObjectStore('saves', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('customRoms')) {
          db.createObjectStore('customRoms', { keyPath: 'id' });
        }
      };
    });

    return this.dbPromise;
  }

  public async init(): Promise<IDBDatabase> {
    return this.initDB();
  }

  public async saveState(slot: number, gameId: string, name: string, thumbnail: string, stateData: any, playtimeSeconds: number): Promise<SaveStateSlot> {
    const db = await this.initDB();
    const saveId = `${gameId}_slot_${slot}`;

    const saveSlot: SaveStateSlot = {
      slot,
      name,
      timestamp: Date.now(),
      thumbnail,
      stateData,
      cloudSynced: true,
      deviceId: this.getCurrentDeviceName(),
      gameId,
      playtimeSeconds
    };

    // Save to IndexedDB
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('saves', 'readwrite');
      const store = tx.objectStore('saves');
      const req = store.put({ id: saveId, ...saveSlot });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // Also sync to Cloud API in background
    try {
      await fetch('/api/sync/saves', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentUserId,
          gameId,
          slotNumber: slot,
          name,
          thumbnail,
          stateData: typeof stateData === 'string' ? stateData : JSON.stringify(stateData),
          device: this.getCurrentDeviceName(),
          playtimeSeconds
        })
      });
    } catch (e) {
      console.warn("Cloud save sync deferred (offline cache active)", e);
    }

    return saveSlot;
  }

  public async loadState(slot: number, gameId: string): Promise<SaveStateSlot | null> {
    const db = await this.initDB();
    const saveId = `${gameId}_slot_${slot}`;

    return new Promise((resolve) => {
      const tx = db.transaction('saves', 'readonly');
      const store = tx.objectStore('saves');
      const req = store.get(saveId);
      req.onsuccess = () => {
        if (req.result) {
          resolve(req.result);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  }

  public async getAllSavesForGame(gameId: string): Promise<SaveStateSlot[]> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('saves', 'readonly');
      const store = tx.objectStore('saves');
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result || []).filter((s: any) => s.gameId === gameId);
        resolve(list);
      };
      req.onerror = () => resolve([]);
    });
  }

  public async exportSaveFile(slot: SaveStateSlot) {
    const jsonStr = JSON.stringify(slot, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slot.gameId}_Slot${slot.slot}_Save.aether`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public async importSaveFile(file: File): Promise<SaveStateSlot> {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (!parsed.gameId || parsed.slot === undefined) {
      throw new Error("Invalid AetherCloud save state file");
    }
    return this.saveState(
      parsed.slot,
      parsed.gameId,
      parsed.name || `Imported Slot ${parsed.slot}`,
      parsed.thumbnail || '',
      parsed.stateData,
      parsed.playtimeSeconds || 0
    );
  }

  public async saveCustomRom(gameId: string, romData: ArrayBuffer, fileName: string): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('customRoms', 'readwrite');
      const store = tx.objectStore('customRoms');
      const req = store.put({
        id: gameId,
        fileName,
        data: romData,
        size: romData.byteLength,
        uploadedAt: Date.now()
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  public async getCustomRom(gameId: string): Promise<{ fileName: string; data: ArrayBuffer; size: number } | null> {
    const db = await this.initDB();
    return new Promise((resolve) => {
      const tx = db.transaction('customRoms', 'readonly');
      const store = tx.objectStore('customRoms');
      const req = store.get(gameId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  }

  public getCurrentDeviceName(): string {
    const ua = navigator.userAgent;
    if (/iPad|Android(?!.*Mobile)|Tablet/i.test(ua)) return 'Tablet';
    if (/Mobile|Android|iPhone|iPod/i.test(ua)) return 'Smartphone (iOS/Android)';
    if (/TV|SmartTV|AndroidTV|CrKey/i.test(ua)) return 'Android TV';
    return 'Desktop PC (Web Console)';
  }

  public getInitialUserProfile(email: string = 'delinacre@gmail.com'): UserProfile {
    return {
      id: this.currentUserId,
      name: 'AetherGamer_X',
      email: email,
      gamerTag: 'RetroArchon_X',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&auto=format&fit=crop&q=80',
      level: 42,
      xp: 18450,
      totalPlaytimeMinutes: 4820,
      trophiesCount: 28,
      cloudSavesCount: 14,
      connectedDevices: [
        { id: 'dev-1', name: 'Desktop Gaming Rig (Chrome)', type: 'desktop', lastSynced: 'Just now', current: true },
        { id: 'dev-2', name: 'Living Room Android TV', type: 'tv', lastSynced: '2 hours ago', current: false },
        { id: 'dev-3', name: 'iPhone 15 Pro (Safari PWA)', type: 'phone', lastSynced: 'Yesterday', current: false },
        { id: 'dev-4', name: 'Galaxy Tab S9 Ultra', type: 'tablet', lastSynced: '3 days ago', current: false }
      ],
      favoriteGames: ['chrono-blade-psx', 'super-retro-kart', 'emerald-monsters-gba']
    };
  }
}

export const cloudSyncService = new CloudSyncService();
