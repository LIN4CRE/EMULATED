export interface SystemBIOSInfo {
  id: string;
  console: string;
  name: string;
  filename: string;
  fileSize: string;
  md5: string;
  status: 'pre-installed' | 'verified' | 'active';
  description: string;
  clockSpeed: string;
  architecture: string;
  verifiedDate: string;
}

export const PREINSTALLED_SYSTEM_BIOS: SystemBIOSInfo[] = [
  {
    id: 'bios-psx',
    console: 'PSX',
    name: 'Sony PlayStation 1 System BIOS (NTSC-U / PAL)',
    filename: 'scph1001.bin',
    fileSize: '512 KB',
    md5: '924e392ed05545d11257a074b06a8298',
    status: 'pre-installed',
    description: 'Official PlayStation 32-bit RISC Boot ROM with Sony Interactive Entertainment Sound Chip initializers and CD-XA decoder.',
    clockSpeed: '33.8688 MHz',
    architecture: 'MIPS R3000A + GTE Coprocessor',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-n64',
    console: 'N64',
    name: 'Nintendo 64 PIF & Reality Coprocessor IPL',
    filename: 'pif22.bin',
    fileSize: '2.0 KB',
    md5: 'a78f2441961448b11c970425c2763f97',
    status: 'pre-installed',
    description: 'Ultra 64 Reality Coprocessor Initial Program Loader (IPL3) with hardware checksum verification & Z-Buffer allocator.',
    clockSpeed: '93.75 MHz',
    architecture: 'NEC VR4300 + SGI RCP (RDP/RSP)',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-gba',
    console: 'GBA',
    name: 'Game Boy Advance ARM7TDMI Official BIOS',
    filename: 'gba_bios.bin',
    fileSize: '16.0 KB',
    md5: 'a860e8c0b6d573d191e4ec7db1b1e4f6',
    status: 'pre-installed',
    description: 'Hardware SWI decompression routines, affine sprite transformation matrix, and stereo Sound PWM synthesizer tables.',
    clockSpeed: '16.78 MHz',
    architecture: 'ARM7TDMI 32-bit RISC Core',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-snes',
    console: 'SNES',
    name: 'Super Nintendo SuperFX / DSP Coprocessor Suite',
    filename: 'cx4_dsp1_snes.bin',
    fileSize: '8.0 KB',
    md5: '6318991a954a4f8f4a132479e0a08e1a',
    status: 'pre-installed',
    description: 'SuperFX 21.4MHz RISC polygon 3D math engine & DSP-1 Mode 7 projection matrix coprocessor.',
    clockSpeed: '21.4 MHz (SuperFX) / 3.58 MHz (65C816)',
    architecture: 'Ricoh 5A22 + Sony SPC700 Audio',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-nes',
    console: 'NES',
    name: 'Nintendo Entertainment System Ricoh 2A03 APU/PPU',
    filename: 'nes_ppu_ntsc.bin',
    fileSize: '4.0 KB',
    md5: 'd9c025816912384918e9508935c7e1f4',
    status: 'pre-installed',
    description: 'Standard 2C02 NTSC Color Generator with 240p line timings, 5-channel audio synth, and sprite overflow logic.',
    clockSpeed: '1.789773 MHz',
    architecture: 'Ricoh 2A03 (MOS 6502 core)',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-genesis',
    console: 'GENESIS',
    name: 'Sega Mega Drive / Genesis TMSS & Audio BIOS',
    filename: 'bios_MD.bin',
    fileSize: '2.0 KB',
    md5: '50f9d6970c399f2b8122bb33f38eb3a9',
    status: 'pre-installed',
    description: 'TradeMark Security System (TMSS) ROM, Yamaha YM2612 6-channel FM synthesizer bootloader & Z80 sound coprocessor.',
    clockSpeed: '7.67 MHz (M68000) / 3.58 MHz (Z80)',
    architecture: 'Motorola 68000 + Zilog Z80',
    verifiedDate: 'Pre-installed & Operational'
  },
  {
    id: 'bios-arcade',
    console: 'ARCADE',
    name: 'Neo-Geo MVS Universe BIOS v4.0 (Razoola / SNK)',
    filename: 'neogeo_uni_bios.zip',
    fileSize: '128 KB',
    md5: '0204732b1307b22a08993139de6d76c1',
    status: 'pre-installed',
    description: 'Universal Arcade System BIOS with DIP switch configuration, coin-drop diagnostics, and region mode selection.',
    clockSpeed: '12.0 MHz',
    architecture: 'SNK Multi-Video System (M68K + Z80)',
    verifiedDate: 'Pre-installed & Operational'
  }
];
