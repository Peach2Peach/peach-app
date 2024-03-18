import { NETWORK } from "@env";
import bitcoinLogo from "./bitcoin.svg";
import bitcoinText from "./bitcoinText.svg";
import bitcoinTransparent from "./bitcoinTransparent.svg";
import fullLogo from "./fullLogo.svg";
import homeLogo from "./homeLogo.svg";
import homeLogoTestnet from "./homeLogoTestnet.svg";
import lightningLogo from "./lightning.svg";
import liquidLogo from "./liquid.svg";
import peachBorder from "./peachBorder.svg";
import peachLogo from "./peachLogo.svg";
import peachOrange from "./peachOrange.svg";

export const LogoIcons = {
  bitcoinLogo,
  liquidLogo,
  lightningLogo,
  bitcoinText,
  bitcoinTransparent,
  fullLogo,
  homeLogo:
    NETWORK === "testnet" || NETWORK === "regtest" ? homeLogoTestnet : homeLogo,
  peachBorder,
  peachLogo,
  peachOrange,
};
