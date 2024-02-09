export const generateSecureRandom = jest.fn(
  (size) =>
    new Promise((resolve) => {
      const uint8 = new Uint8Array(size);
      resolve(uint8.map(() => Math.floor(Math.random() * 90) + 10));
    }),
);
