// @flow

/** Device ID */
export const ID: number = 0x58;

/** Device registers */
export const ADDR = {
  TEMP_XLSB: 0xfc,
  TEMP_LSB: 0xfb,
  TEMP_MSB: 0xfa,
  TEMP: 0xfa,
  PRESS_XLSB: 0xf9,
  PRESS_LSB: 0xf8,
  PRESS_MSB: 0xf7,
  PRESS: 0xf7,
  CONFIG: 0xf5,
  CTRL_MEAS: 0xf4,
  STATUS: 0xf3,
  RESET: 0xe0,
  ID: 0xd0,
  TEMP_CORRECTION: 0x88,
  PRESS_CORRECTION: 0x8e,
};

export const RESET = 0xb6;

export const STATUS_MASK = {
  IM_UPDATE: 0b00000001,
  MEASURING: 0b00001000,
};


export const CTRL_MEAS_MASK = {
  OSRSR_T: 0b11100000,
  OSRSR_P: 0b00011100,
  MODE: 0b00000011,
};

export const TEMP_SAMPLING = {
  SKIPPED: 0b00000000,
  ZERO: 0b00100000,
  ONE: 0b01000000,
  TWO: 0b01100000,
  THREE: 0b10000000,
  FOUR: 0b10100000,
};

export const PRESS_SAMPLING = {
  SKIPPED: 0b00000000,
  ZERO: 0b00000100,
  ONE: 0b00001000,
  TWO: 0b00001100,
  THREE: 0b00010000,
  FOUR: 0b00010100,
};

export const CONFIG_MASK = {
  STANDBY: 0b11100000,
  FILTER: 0b00011100,
  SPI3W_EN: 0b00000001,
};

export const MODE = {
  SLEEP: 0b00000000,
  FORCED: 0b00000001,
  NORMAL: 0b00000011,
};

export const STANDBY = {
  '500u': 0b00000000,
  '62m': 0b00100000,
  '125m': 0b01000000,
  '250m': 0b01100000,
  '500m': 0b10000000,
  '1s': 0b10100000,
  '2s': 0b11000000,
  '4s': 0b11100000,
};

export const FILTER = {
  OFF: 0b00000000,
  '2x': 0b00000100,
  '4x': 0b00001000,
  '8x': 0b00001100,
  '16x': 0b00010000,
  '32x': 0b00010100,
  '64x': 0b00011000,
  '128x': 0b00011100,
};
