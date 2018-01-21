// @flow

/** Promised timeout */
export default (time: number): Promise<void> => new Promise((resolve: () => void) => {
  setTimeout(() => {
    resolve();
  }, time);
});
