export default class Device {
  constructor(bus, address) {
    this.bus = bus;
    this.address = address;
  }

  // Plain I2C
  read(length, buffer) {
    return this.queue.add(() => this.bus.i2cRead(this.address, length, buffer));
  }
  write(length, buffer) {
    return this.queue.add(() => this.bus.i2cWrite(this.address, length, buffer));
  }

  // SMBus
  readByte(cmd) {
    return this.bus.readByte(this.address, cmd);
  }
  readWord(cmd) {
    return this.bus.readWord(this.address, cmd);
  }
  readI2cBlock(cmd, length, buffer) {
    return this.bus.readI2cBlock(this.address, cmd, length, buffer);
  }
  receiveByte() {
    return this.bus.receiveByte(this.address);
  }
  sendByte(byte) {
    return this.bus.sendByte(this.address, byte);
  }
  writeByte(cmd, byte) {
    return this.bus.writeByte(this.address, cmd, byte);
  }
  writeWord(cmd, word) {
    return this.bus.writeWord(this.address, cmd, word);
  }
  writeQuick(bit) {
    return this.bus.writeQuick(this.address, bit);
  }
  writeI2cBlock(cmd, length, buffer) {
    return this.bus.writeI2cBlock(this.address, cmd, length, buffer);
  }
}
