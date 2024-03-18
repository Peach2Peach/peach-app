import { Settings } from "../settings/Settings";
import { LightningWallet } from "../wallet/LightningWallet";
import { LiquidWallet } from "../wallet/LiquidWallet";
import { Wallet } from "../wallet/Wallet";
import { YourTrades } from "../yourTrades/YourTrades";
import { Home } from "./Home";

export const homeTabNames = [
  "home",
  "wallet",
  "liquidWallet",
  "lightningWallet",
  "yourTrades",
  "settings",
] as const;
export type HomeTabName = (typeof homeTabNames)[number];
export const homeTabs: Record<HomeTabName, () => JSX.Element> = {
  home: Home,
  wallet: Wallet,
  yourTrades: YourTrades,
  settings: Settings,
  liquidWallet: LiquidWallet,
  lightningWallet: LightningWallet,
};
