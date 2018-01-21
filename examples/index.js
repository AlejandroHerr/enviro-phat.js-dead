// @flow
import { I2cBus as Bus } from 'i2c-bus-promised';
import BMP280 from '../src/BMP280';

const formatValue = (value: number, decimals: number = 2): string => {
  const factor = 10 ** decimals;

  const formatted = Math.trunc(value * factor) / factor;

  return formatted.toString();
};

const bus = new Bus();

const bmp280 = new BMP280(bus);


bmp280.init()
  .then(async () => {
    await bmp280.readTemperature()
      .then((temperature: number) => {
        console.log(`Temperature ${formatValue(temperature)} °C`);
      });
    await bmp280.readPressure()
      .then((pressure: number) => {
        console.log(`Pressure ${formatValue(pressure)} hPa`);
      });
  })
  .catch(console.log)
  .then(() => process.exit(0));
