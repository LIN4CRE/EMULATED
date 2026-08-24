export interface GameInstallRecord {
  gameId: string;
  installedAt: string;
  biosUsed: string;
  romChecksum: string;
  shaderPrecompiled: boolean;
  cloudSyncLinked: boolean;
  version: string;
}

const STORAGE_KEY = 'aether_installed_games_v1';

class InstallService {
  private installedMap: Map<string, GameInstallRecord> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          parsed.forEach(item => {
            if (item && item.gameId) {
              this.installedMap.set(item.gameId, item);
            }
          });
        }
      }
    } catch (e) {
      console.warn('Could not load install registry from storage', e);
    }
  }

  private saveToStorage() {
    try {
      const records = Array.from(this.installedMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Could not save install registry to storage', e);
    }
  }

  public isGameInstalled(gameId: string): boolean {
    return this.installedMap.has(gameId);
  }

  public getInstallRecord(gameId: string): GameInstallRecord | undefined {
    return this.installedMap.get(gameId);
  }

  public markInstalled(gameId: string, biosUsed: string = 'Auto-Linked Pre-Installed Core'): GameInstallRecord {
    const record: GameInstallRecord = {
      gameId,
      installedAt: new Date().toISOString(),
      biosUsed,
      romChecksum: `CRC32-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      shaderPrecompiled: true,
      cloudSyncLinked: true,
      version: '2.4.0'
    };
    this.installedMap.set(gameId, record);
    this.saveToStorage();
    return record;
  }

  public uninstallGame(gameId: string) {
    this.installedMap.delete(gameId);
    this.saveToStorage();
  }

  public getAllInstalledIds(): string[] {
    return Array.from(this.installedMap.keys());
  }
}

export const installService = new InstallService();
