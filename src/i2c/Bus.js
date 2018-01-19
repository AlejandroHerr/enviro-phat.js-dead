import i2c from 'i2c-bus';
import { promisifyAll } from 'bluebird';
import PQueue from 'p-queue';

export default class Bus {
  constructor(busNumber = 1) {
    this.bus = promisifyAll(i2c.open(busNumber, (error) => {
      if (error) {
        throw new Error(`Error opening i2c bus: ${error.message}`);
      }
    }));

    this.queue = new PQueue({ concurrency: 1 });
  }

  close() {
    return this.queue.add(() => this.bus.closeAsync());
  }

  // Information
  i2cFuncs() {
    return this.queue.add(() => this.bus.i2cFuncsAsync());
  }
  scan() {
    return this.queue.add(() => this.bus.scanAsync());
  }

  // Plain I2C
  read(addr, length, buffer) {
    return this.queue.add(() => this.bus.i2cReadAsync(addr, length, buffer));
  }
  write(addr, length, buffer) {
    return this.queue.add(() => this.bus.i2cWriteAsync(addr, length, buffer));
  }

  // SMBus
  readByte(addr, cmd) {
    return this.queue.add(() => this.bus.readByteAsync(addr, cmd));
  }
  readWord(addr, cmd) {
    return this.queue.add(() => this.bus.readWordAsync(addr, cmd));
  }
  readI2cBlock(addr, cmd, length, buffer) {
    return this.queue.add(() => this.bus.readI2cBlockAsync(addr, cmd, length, buffer));
  }
  receiveByte(addr) {
    return this.queue.add(() => this.bus.receiveByteAsync(addr));
  }
  sendByte(addr, byte) {
    return this.queue.add(() => this.bus.sendByteAsync(addr, byte));
  }
  writeByte(addr, cmd, byte) {
    return this.queue.add(() => this.bus.writeByteAsync(addr, cmd, byte));
  }
  writeWord(addr, cmd, word) {
    return this.queue.add(() => this.bus.writeWordAsync(addr, cmd, word));
  }
  writeQuick(addr, bit) {
    return this.queue.add(() => this.bus.writeQuickAsync(addr, bit));
  }
  writeI2cBlock(addr, cmd, length, buffer) {
    return this.queue.add(() => this.bus.writeI2cBlockAsync(addr, cmd, length, buffer));
  }
}
