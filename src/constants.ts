import { getBuildNumber, getUniqueIdSync, getVersion, isEmulatorSync } from 'react-native-device-info'
import { IconType } from './assets/icons'
import { sha256 } from './utils/crypto/sha256'

export const SATSINBTC = 100000000
export const MSINASECOND = 1000
export const MSINAMINUTE = MSINASECOND * 60
export const MSINANHOUR = MSINAMINUTE * 60
export const MSINADAY = MSINANHOUR * 24
export const MSINAMONTH = MSINADAY * 30

export const FIFTEEN_SECONDS = 15 * MSINASECOND

// time to automatically restart app when calling app from background after this time has passed
export const TIMETORESTART = 5 * MSINAMINUTE

export const MAXTRADESWITHOUTHBACKUP = 3

export const APPVERSION = getVersion()
export const BUILDNUMBER = getBuildNumber()

export let CLIENTSERVERTIMEDIFFERENCE = 0
export const setClientServerTimeDifference = (diff: number) => (CLIENTSERVERTIMEDIFFERENCE = diff)

export const ISEMULATOR = isEmulatorSync()

export const UNIQUEID = sha256(getUniqueIdSync())

export const TWITTER = 'https://twitter.com/peachbitcoin'
export const INSTAGRAM = 'https://www.instagram.com/peachbitcoin'
export const TELEGRAM = 'https://t.me/+3KpdrMw25xBhNGJk'
export const DISCORD = 'https://discord.gg/ypeHz3SW54'
export const TWITCH = 'https://www.twitch.tv/peachbitcoin'
export const NOSTR = 'https://snort.social/p/npub15369wu3wzzar5fclhecyqfv683x69n6nhlg7rxqnsg2dydgxflpq3apswl'
export const YOUTUBE = 'https://www.youtube.com/@peachbitcoin'

export const badgeIconMap: Record<Medal, IconType> = {
  superTrader: 'star',
  fastTrader: 'zap',
  ambassador: 'award',
}
