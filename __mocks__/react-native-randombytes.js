export const randomBytes = (count, callback) => {
  callback(null, new ArrayBuffer(count))
}
