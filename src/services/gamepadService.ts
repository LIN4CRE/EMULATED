import { GamepadMapping } from '../types';

export const DEFAULT_KEYBOARD_MAPPING: GamepadMapping = {
  dpadUp: 'ArrowUp',
  dpadDown: 'ArrowDown',
  dpadLeft: 'ArrowLeft',
  dpadRight: 'ArrowRight',
  btnA: 'KeyX', // Cross / A
  btnB: 'KeyZ', // Circle / B
  btnX: 'KeyA', // Square / X
  btnY: 'KeyS', // Triangle / Y
  btnL1: 'KeyQ', // L1 / L
  btnR1: 'KeyW', // R1 / R
  btnL2: 'KeyE', // L2 / Z
  btnR2: 'KeyR', // R2
  start: 'Enter', // Start
  select: 'ShiftRight', // Select
  turboA: 'KeyC',
  turboB: 'KeyV',
  rewind: 'Backspace',
  fastForward: 'Space',
  deadzone: 0.15,
  vibrationEnabled: true
};

class GamepadService {
  private connectedGamepadIndex: number | null = null;
  private currentMapping: GamepadMapping = { ...DEFAULT_KEYBOARD_MAPPING };
  private listeners: ((buttons: Record<string, boolean>) => void)[] = [];
  private pollAnimFrame: number | null = null;
  private gamepadName: string = 'No Gamepad Detected';

  constructor() {
    this.loadMapping();
    window.addEventListener('gamepadconnected', (e: any) => {
      this.connectedGamepadIndex = e.gamepad.index;
      this.gamepadName = e.gamepad.id || 'Standard Gamepad';
      console.log('Gamepad connected:', e.gamepad);
      this.startPolling();
    });

    window.addEventListener('gamepaddisconnected', () => {
      this.connectedGamepadIndex = null;
      this.gamepadName = 'No Gamepad Detected';
    });
  }

  public getGamepadName(): string {
    return this.gamepadName;
  }

  public isGamepadConnected(): boolean {
    return this.connectedGamepadIndex !== null;
  }

  public getMapping(): GamepadMapping {
    return { ...this.currentMapping };
  }

  public updateMapping(newMapping: Partial<GamepadMapping>) {
    this.currentMapping = { ...this.currentMapping, ...newMapping };
    localStorage.setItem('aether_gamepad_mapping', JSON.stringify(this.currentMapping));
  }

  private loadMapping() {
    try {
      const saved = localStorage.getItem('aether_gamepad_mapping');
      if (saved) {
        this.currentMapping = { ...DEFAULT_KEYBOARD_MAPPING, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Failed to parse gamepad mapping", e);
    }
  }

  public vibrate(durationMs: number = 100, strongMagnitude: number = 0.5, weakMagnitude: number = 0.5) {
    if (!this.currentMapping.vibrationEnabled) return;
    
    // Check Web Gamepad vibrationActuator
    if (this.connectedGamepadIndex !== null && navigator.getGamepads) {
      const gp = navigator.getGamepads()[this.connectedGamepadIndex];
      if (gp && (gp as any).vibrationActuator) {
        try {
          (gp as any).vibrationActuator.playEffect('dual-rumble', {
            startDelay: 0,
            duration: durationMs,
            weakMagnitude,
            strongMagnitude,
          });
        } catch (e) {
          // ignore
        }
      }
    }

    // Check device navigator.vibrate
    if (navigator.vibrate) {
      try {
        navigator.vibrate(durationMs);
      } catch (e) {
        // ignore
      }
    }
  }

  public pollButtons(): Record<string, boolean> {
    const states: Record<string, boolean> = {
      up: false,
      down: false,
      left: false,
      right: false,
      btnA: false,
      btnB: false,
      btnX: false,
      btnY: false,
      l1: false,
      r1: false,
      l2: false,
      r2: false,
      start: false,
      select: false,
      turboA: false,
      turboB: false,
      rewind: false,
      fastForward: false
    };

    if (this.connectedGamepadIndex === null || !navigator.getGamepads) {
      return states;
    }

    const gp = navigator.getGamepads()[this.connectedGamepadIndex];
    if (!gp) return states;

    const deadzone = this.currentMapping.deadzone || 0.15;

    // Standard Gamepad Buttons
    // 0: A/Cross, 1: B/Circle, 2: X/Square, 3: Y/Triangle
    // 4: L1, 5: R1, 6: L2, 7: R2, 8: Select, 9: Start
    // 12: Dpad Up, 13: Dpad Down, 14: Dpad Left, 15: Dpad Right
    if (gp.buttons[0]?.pressed) states.btnA = true;
    if (gp.buttons[1]?.pressed) states.btnB = true;
    if (gp.buttons[2]?.pressed) states.btnX = true;
    if (gp.buttons[3]?.pressed) states.btnY = true;
    if (gp.buttons[4]?.pressed) states.l1 = true;
    if (gp.buttons[5]?.pressed) states.r1 = true;
    if (gp.buttons[6]?.pressed || gp.buttons[6]?.value > 0.3) states.l2 = true;
    if (gp.buttons[7]?.pressed || gp.buttons[7]?.value > 0.3) states.r2 = true;
    if (gp.buttons[8]?.pressed) states.select = true;
    if (gp.buttons[9]?.pressed) states.start = true;

    if (gp.buttons[12]?.pressed) states.up = true;
    if (gp.buttons[13]?.pressed) states.down = true;
    if (gp.buttons[14]?.pressed) states.left = true;
    if (gp.buttons[15]?.pressed) states.right = true;

    // Analog stick axes fallback
    if (gp.axes && gp.axes.length >= 2) {
      const axisX = gp.axes[0];
      const axisY = gp.axes[1];
      if (axisX < -deadzone) states.left = true;
      if (axisX > deadzone) states.right = true;
      if (axisY < -deadzone) states.up = true;
      if (axisY > deadzone) states.down = true;
    }

    return states;
  }

  private startPolling() {
    if (this.pollAnimFrame) return;
    const loop = () => {
      this.pollAnimFrame = requestAnimationFrame(loop);
    };
    this.pollAnimFrame = requestAnimationFrame(loop);
  }
}

export const gamepadService = new GamepadService();
