import { Buy } from '../buy/Buy'
import { Settings } from '../settings/Settings'
import { Wallet } from '../wallet/Wallet'
import { YourTrades } from '../yourTrades/YourTrades'

export const homeTabNames = ['home', 'wallet', 'yourTrades', 'settings'] as const
export type HomeTabName = (typeof homeTabNames)[number]
export const homeTabs: Record<HomeTabName, () => JSX.Element> = {
  home: Buy,
  wallet: Wallet,
  yourTrades: YourTrades,
  settings: Settings,
}
