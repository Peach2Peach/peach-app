import { NETWORK } from "@env";
import bitcoinLogo from "./bitcoin.svg";
import bitcoinText from "./bitcoinText.svg";
import bitcoinTextDark from "./bitcoinTextDark.svg";
import bitcoinTransparent from "./bitcoinTransparent.svg";
import fullLogo from "./fullLogo.svg";
import homeLogo from "./homeLogo.svg";
import homeLogoSmall from "./homeLogoSmall.svg";
import homeLogoTestnet from "./homeLogoTestnet.svg";
import homeLogoTestnetSmall from "./homeLogoTestnetSmall.svg";
import newBitcoinLogo from "./newBitcoinLogo.svg";
import peachBorder from "./peachBorder.svg";
import peachLogo from "./peachLogo.svg";
import peachOrange from "./peachOrange.svg";

export const LogoIcons = {
  bitcoinLogo,
  bitcoinText,
  bitcoinTextDark,
  bitcoinTransparent,
  fullLogo,
  homeLogo: NETWORK === "bitcoin" ? homeLogo : homeLogoTestnet,
  homeLogoSmall: NETWORK === "bitcoin" ? homeLogoSmall : homeLogoTestnetSmall,
  newBitcoinLogo,
  peachBorder,
  peachLogo,
  peachOrange,
};
