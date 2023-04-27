export const randomBytes = jest.fn((size, callback) => {
  let uint8 = new Uint8Array(size)
  uint8 = uint8.map(() => Math.floor(Math.random() * 90) + 10)
  callback(null, uint8)
})
