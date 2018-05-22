// @flow
import { I2cDevice, type I2cBus } from 'i2c-bus-promised';
import { type AddrType } from 'i2c-bus-promised/lib/types';
import { ID, ADDR, RESET, TEMP_SAMPLING, PRESS_SAMPLING, MODE, STANDBY, FILTER } from './constants';
import sleep from '../helpers';

const MAGNITUDE: { TEMP: boolean, PRESS: boolean } = {
  TEMP: true,
  PRESS: false,
};

/**
 * Default profile used by pimoroni
 * @module BMP280.DEFAULT_PROFILE
 */
const DEFAUL_PROFILE = {
  ctrlMeas: TEMP_SAMPLING.FOUR | PRESS_SAMPLING.FOUR | MODE.NORMAL,
  config: STANDBY['500m'] | FILTER['16x'],
};

/**
 * Something
 *
 * @extends {I2cDevice}
 */
export default class BMP280 extends I2cDevice {
  temperatureCorrection: Array<number>;
  pressureCorrection: Array<number>;

  static calculateTempFine: (number, Array<number>) => number;
  static calculatePress: (number, number, Array<number>) => number;

  constructor(bus: I2cBus, address?: AddrType = 0x77) {
    super(bus, address);

    this.temperatureCorrection = [];
    this.pressureCorrection = [];
  }

  /** Inits the sensor */
  async init(profile: { ctrlMeas: number, config: number } = DEFAUL_PROFILE): Promise<this> {
    const id = await this.readByte(ADDR.ID);

    if (id !== ID) {
      throw new Error('The device is not a BMP280');
    }


    await this.reset().then(() => sleep(1));

    await this.writeByte(ADDR.CTRL_MEAS, profile.ctrlMeas).then(() => sleep(100));
    await this.writeByte(ADDR.CONFIG, profile.config).then(() => sleep(100));

    await this.readTempCorrection();
    await this.readPressureCorrection();

    await sleep(100);

    return this;
  }

  /** Reads temperature correction from the device */
  async readTempCorrection(): Promise<void> {
    const buffer = Buffer.alloc(6);
    await this.readI2cBlock(ADDR.TEMP_CORRECTION, 6, buffer);

    this.temperatureCorrection[0] = buffer.readUInt16LE(0);
    this.temperatureCorrection[1] = buffer.readInt16LE(2);
    this.temperatureCorrection[2] = buffer.readInt16LE(4);
  }

  /** Reads pressure correction from the device */
  async readPressureCorrection(): Promise<void> {
    const buffer = Buffer.alloc(18);
    await this.readI2cBlock(ADDR.PRESS_CORRECTION, 18, buffer);

    this.pressureCorrection[0] = buffer.readUInt16LE(0);
    this.pressureCorrection[1] = buffer.readInt16LE(2);
    this.pressureCorrection[2] = buffer.readInt16LE(4);
    this.pressureCorrection[3] = buffer.readInt16LE(6);
    this.pressureCorrection[4] = buffer.readInt16LE(8);
    this.pressureCorrection[5] = buffer.readInt16LE(10);
    this.pressureCorrection[6] = buffer.readInt16LE(12);
    this.pressureCorrection[7] = buffer.readInt16LE(14);
    this.pressureCorrection[8] = buffer.readInt16LE(16);
  }

  /** Resets device */
  reset(): Promise<void> {
    return this.writeByte(ADDR.RESET, RESET);
  }

  /** Reads magnitude (preassure or temperature) */
  async readMagnitude(magnitude: boolean = MAGNITUDE.TEMP): Promise<number> {
    const buffer = Buffer.alloc(3);

    await this.readI2cBlock(magnitude ? ADDR.TEMP : ADDR.PRESS, 3, buffer);

    return buffer.readUIntBE(0, 3) >>> 4;
  }

  /** Reads temperature */
  async readTemperature(): Promise<number> {
    const rawTemp = await this.readMagnitude(MAGNITUDE.TEMP);

    const tempFine = BMP280.calculateTempFine(rawTemp, this.temperatureCorrection);

    return tempFine / 5120;
  }

  /** Reads pressure */
  async readPressure(): Promise<number> {
    const rawTemp = await this.readMagnitude(MAGNITUDE.TEMP);
    const rawPress = await this.readMagnitude(MAGNITUDE.PRESS);

    const tempFine = BMP280.calculateTempFine(rawTemp, this.temperatureCorrection);

    return BMP280.calculatePress(rawPress, tempFine, this.pressureCorrection);
  }
}

/** Calculates Press accodring to the datasheet */
BMP280.calculateTempFine = (rawTemp: number, correction: Array<number>): number => {
  const left =
      ((rawTemp / 16384.0) - (correction[0] / 1024.0))
      * correction[1];
  const right =
      ((rawTemp / 131072.0) - (correction[0] / 8192.0))
      * ((rawTemp / 131072.0) - (correction[0] / 8192.0))
      * correction[2];

  return (left + right);
};

/** Calculates Press accodring to the datasheet */
BMP280.calculatePress = (rawPress: number, tempFine: number, correction: Array<number>): number => {
  let var1 = (tempFine / 2.0) - 64000.0;
  let var2 = var1 * var1 * (correction[5] / 32768.0);
  var2 += (var1 * correction[4] * 2);
  var2 = (var2 / 4.0) + (correction[3] * 65536.0);
  var1 = ((correction[2] * var1 * (var1 / 524288.0)) + (correction[1] * var1)) / 524288.0;
  var1 = (1.0 + (var1 / 32768.0)) * correction[0];
  let press = 1048576.0 - rawPress;
  press = (press - (var2 / 4096.0)) * (6250.0 / var1);
  var1 = correction[8] * ((press * press) / 2147483648.0);
  var2 = (press * correction[7]) / 32768.0;

  return press + ((var1 + var2 + correction[6]) / 16.0);
};
