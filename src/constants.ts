import { getBuildNumber, getUniqueIdSync, getVersion } from 'react-native-device-info'
import { IconType } from './assets/icons'
import tw from './styles/tailwind'
import { sha256 } from './utils/crypto/sha256'

export const THOUSANDS_GROUP = 3
export const CENT = 100
export const SATSINBTC = 100000000
export const TOTAL_BITCOIN = 21000000
export const TOTAL_SATS = TOTAL_BITCOIN * SATSINBTC
export const MSINASECOND = 1000
const SECONDS_IN_A_MINUTE = 60
export const MSINAMINUTE = MSINASECOND * SECONDS_IN_A_MINUTE
const MINUTES_IN_AN_HOUR = 60
export const MSINANHOUR = MSINAMINUTE * MINUTES_IN_AN_HOUR
const HOURS_IN_A_DAY = 24
export const MSINADAY = MSINANHOUR * HOURS_IN_A_DAY
const DAYS_IN_A_MONTH = 30
export const MSINAMONTH = DAYS_IN_A_MONTH * MSINADAY
const FIFTEEN = 15
export const FIFTEEN_SECONDS = FIFTEEN * MSINASECOND

export const NEW_USER_THRESHOLD = 3

export const APPVERSION = getVersion()
export const BUILDNUMBER = getBuildNumber()

export let CLIENTSERVERTIMEDIFFERENCE = 0
export const setClientServerTimeDifference = (diff: number) => (CLIENTSERVERTIMEDIFFERENCE = diff)

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

export const fullScreenTabNavigationScreenOptions = {
  tabBarStyle: [tw`bg-transparent mx-sm`, tw`md:mx-md`],
  tabBarContentContainerStyle: tw`bg-transparent`,
  tabBarIndicatorStyle: tw`bg-black-100`,
  tabBarItemStyle: tw`p-0`,
  tabBarPressColor: 'transparent',
  tabBarLabelStyle: tw`lowercase input-title`,
}
