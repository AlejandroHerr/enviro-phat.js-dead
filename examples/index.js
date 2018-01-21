import Bus from '../src/i2c/Bus';
import BMP280 from '../src/BMP280';

const bus = new Bus();
bus.i2cFuncs().then((funcs) => {
  console.info('i2c functions:');
  Object.entries(funcs).forEach(([name, cmd]) => {
    console.info(`\t${name} --> 0x${cmd.toString(16)}`);
  });
})
  .then(() => bus.scan())
  .then((addresses) => {
    console.info(`Available devices: ${addresses.map(addr => `0x${addr.toString(16)}`)}`);
  });
const bmp280 = new BMP280(bus);

bmp280.init()
  .then(() => bmp280.readTemperature())
  .then(console.log)
  .catch(console.log)
  .then(() => process.exit(0));
