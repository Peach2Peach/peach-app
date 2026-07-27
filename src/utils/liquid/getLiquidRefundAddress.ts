import { NETWORK } from "@env";
import { bech32 } from "bech32";
import { crypto } from "bitcoinjs-lib";
import { getWallet } from "../wallet/getWallet";
import { LIQUID_COIN_TYPE, LIQUID_HRP } from "./constants";

const SEGWIT_V0 = 0;
const CHANGE_KEYCHAIN = 1;
const INDEX = 0;

/** BIP84 on Liquid's own coin type, so the same seed restores in any Liquid
 * wallet. Testnet and regtest share coin type 1 with the mainchain wallet. */
export const getLiquidRefundAddressPath = () =>
  `m/84'/${NETWORK === "bitcoin" ? LIQUID_COIN_TYPE : 1}'/0'/${CHANGE_KEYCHAIN}/${INDEX}`;

/**
 * The Peach wallet's Liquid refund address: change index 0, unconfidential
 * P2WPKH.
 *
 * Unconfidential on purpose — a blinded address would need a SLIP-77 blinding
 * key the server does not have, and the refund could not be paid out.
 *
 * Note the Peach wallet itself is mainchain-only (BDK), so it cannot spend
 * what lands here; recovery is by restoring the seed phrase in a Liquid
 * wallet at the path above.
 */
export function getLiquidRefundAddress() {
  const wallet = getWallet();
  if (!wallet) throw new Error("WALLET_NOT_READY");

  const keyPair = wallet.derivePath(getLiquidRefundAddressPath());
  const witnessProgram = crypto.hash160(keyPair.publicKey);
  const hrp = LIQUID_HRP[NETWORK] ?? LIQUID_HRP.bitcoin;

  return bech32.encode(hrp, [SEGWIT_V0, ...bech32.toWords(witnessProgram)]);
}
