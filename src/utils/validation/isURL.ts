import { addProtocol } from '../web/addProtocol'

export const isURL = (url: string) => {
  try {
    return !!new URL(addProtocol(url.toLowerCase(), 'https'))
  } catch (e) {
    return false
  }
}
