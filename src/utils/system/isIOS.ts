import { getOS } from './getOS'

export const isIOS = () => getOS() === 'ios'
