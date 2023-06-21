const { randomBytes } = require('react-native-randombytes')
import { error } from '../log'

export const getRandom = (count: number): Promise<Buffer> =>
  new Promise((resolve, reject) =>
    randomBytes(count, (err: any, bytes: Buffer) => {
      if (err) {
        error(err)
        reject(err)
      } else {
        resolve(bytes)
      }
    }),
  )
