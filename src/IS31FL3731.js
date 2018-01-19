import { Buffer } from 'buffer';
import Device from './i2c/Device';
import { REGISTER, BANK, SHUTDOWN } from './constants/IS31FL3731';

const WIDTH = 18;
const HEIGHT = 8;

export default class IS31FL3731 extends Device {
  async reset() {
    await this.writeCommand(BANK.FUNCTION);

    return this.sleep(true)
      .then(() => new Promise((resolve) => {
        setTimeout(() => { resolve(); }, 1);
      }))
      .then(() => this.sleep(false));
  }

  sleep(shutdown = false) {
    return this.writeByteRegister(REGISTER.SHUTDOWN, shutdown ? SHUTDOWN.ON : SHUTDOWN.OFF);
  }

  async frame(frame = null, show = true) {
    if (frame === null) {
      return this.currentFrame;
    }

    if (frame < 0 || frame > 8) {
      throw new Error('Frame out of range: 0-8');
    }

    this.currentFrame = frame;

    if (show) {
      await this.writeCommand(BANK.FUNCTION);
      await this.writeByteRegister(REGISTER.FRAME, frame);
    }

    return this;
  }

  show(buffer) {
    const showBuffer = buffer.size > WIDTH * HEIGHT
      ? buffer.copy(Buffer.alloc(WIDTH * HEIGHT, 0, 0, WIDTH * HEIGHT))
      : buffer;

    let a;
    while (a = b()) {

    }
    do {

    }while()
  }
  /**
   * Switch display driver memory bank
   */
  writeCommand(value = null) {
    if (value === null) {
      return this.readCommand();
    }

    return this.writeByte(REGISTER.BANK, value);
  }

  readCommand() {
    return this.readByte(REGISTER.BANK);
  }

  /**
   * Write display driver register
   */
  writeByteRegister(register, value = null) {
    if (value === null) {
      return this.readByteRegister(register);
    }

    return this.writeByte(register, value);
  }
  readByteRegister(register) {
    return this.readByte(register);
  }

  writeRegister(register, data = []) {
    const buffer = Buffer.isBuffer(data)
      ? data
      : Buffer.from(data);

    return this.writeI2cBlock(register, buffer.length, buffer);
  }
}
