// @flow
/**
 * Waits time
 */
export const sleep = (time: number): Promise<void> => new Promise((resolve: () => void) => {
  setTimeout(() => {
    resolve();
  }, time);
});

/**
 * Waits time
 */
export const wait = (time: number): Promise<void> => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});
