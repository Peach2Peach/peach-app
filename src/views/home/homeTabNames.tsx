import { Settings } from '../settings/Settings'
import { Wallet } from '../wallet/Wallet'
import { YourTrades } from '../yourTrades/YourTrades'
import { Home } from './Home'

export const homeTabNames = ['home', 'wallet', 'yourTrades', 'settings'] as const
export type HomeTabName = (typeof homeTabNames)[number]
export const homeTabs: Record<HomeTabName, () => JSX.Element> = {
  home: Home,
  wallet: Wallet,
  yourTrades: YourTrades,
  settings: Settings,
}
