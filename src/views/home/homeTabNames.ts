import { Buy } from '../buy/Buy'
import { Sell } from '../sell/Sell'
import { Settings } from '../settings/Settings'
import { Wallet } from '../wallet/Wallet'
import { YourTrades } from '../yourTrades/YourTrades'

export const homeTabNames = ['buy', 'sell', 'wallet', 'yourTrades', 'settings'] as const
export type HomeTabName = (typeof homeTabNames)[number]
export const homeTabs: Record<HomeTabName, () => JSX.Element> = {
  buy: Buy,
  sell: Sell,
  wallet: Wallet,
  yourTrades: YourTrades,
  settings: Settings,
}
