import { validateMnemonic, wordlists } from "bip39";
import { address } from "bitcoinjs-lib";
import bolt11 from "bolt11";
import { address as liquidAddress, networks } from "liquidjs-lib";
import { getLiquidNetwork } from "../wallet/getLiquidNetwork";
import { getNetwork } from "../wallet/getNetwork";
import { addProtocol } from "../web/addProtocol";
import { isEmail } from "./isEmail";

const MIN_PASSWORD_LENGTH = 8;
export const rules: Record<string, (value: string, param?: string | number | boolean) => boolean> = {
  required: (value: string) => !!value,
  email: isEmail,
  url: isURL,
  bitcoinAddress: isBitcoinAddress,
  liquidAddress: (value: string) => isLiquidAddress(value, getLiquidNetwork()),
  lightningInvoice: isLightningInvoice,
  invoiceHasCorrectAmount: invoiceHasCorrectAmount,
  password: (value: string) => !!value && value.length >= MIN_PASSWORD_LENGTH,
  referralCode: isReferralCode,
  bip39: (value: string) => validateMnemonic(value),
  bip39Word: (value: string) => wordlists.english.includes(value),
  feeRate: isValidFeeRate,
};

export type Rule = keyof typeof rules;

function isBitcoinAddress(value: string) {
  const network = getNetwork();
  try {
    const result = address.fromBech32(value);
    return result.prefix === network.bech32;
  } catch (e) {
    try {
      address.toOutputScript(value, network);
      return true;
    } catch (e2) {
      return false;
    }
  }
}

export function isLiquidAddress(value: string, network: networks.Network) {
  try {
    const result = liquidAddress.fromBech32(value);
    return result.prefix === network.bech32;
  } catch (e) {
    try {
      liquidAddress.toOutputScript(value, network);
      return true;
    } catch (e2) {
      return false;
    }
  }
}

function isLightningInvoice(value: string) {
  try {
    const invoice = bolt11.decode(value)
    return !!invoice
  } catch(e) {
    return false
  }
}

function invoiceHasCorrectAmount(value: string, amount?: string | number | boolean) {
  if (!amount || isNaN(Number(amount))) return true
  try {
    const invoice = bolt11.decode(value)
    return invoice.satoshis === amount
  } catch(e) {
    return false
  }
}

function isURL(url: string) {
  try {
    return !!new URL(addProtocol(url.toLowerCase(), "https"));
  } catch (e) {
    return false;
  }
}

function isReferralCode(code: string) {
  return code.length > 0 && /^[A-Z0-9]{1,16}$/u.test(code);
}

function isValidFeeRate(feeRate: string) {
  return /^[0-9.]*$/u.test(feeRate) && Number(feeRate) >= 1;
}
