import { BIP32Interface } from "bip32";
import { Signer } from "bip322-liquid-js";
import * as liquid from "liquidjs-lib";
import { info } from "../log/info";
import { useLiquidWalletState } from "./useLiquidWalletState";
import { useWalletState } from "./walletStore";

type PeachLiquidJSWalletProps = {
  wallet: BIP32Interface;
  network?: liquid.networks.Network;
  gapLimit?: number;
};
const defaultGapLimit = 25;
export class PeachLiquidJSWallet {
  jsWallet: BIP32Interface;

  network: liquid.networks.Network;

  derivationPath: string;

  gapLimit: number;

  addresses: string[];

  constructor({
    wallet,
    network = liquid.networks.liquid,
    gapLimit = defaultGapLimit,
  }: PeachLiquidJSWalletProps) {
    this.jsWallet = wallet;

    this.network = network;
    this.gapLimit = gapLimit;
    this.addresses = useLiquidWalletState.getState().addresses;

    this.derivationPath = `m/49'/${network === liquid.networks.liquid ? "0" : "1"}'/0'`;
  }

  getKeyPair(index: number) {
    const keyPair = this.jsWallet.derivePath(
      `${this.derivationPath}/0/${index}`,
    );
    keyPair.network = this.network;
    return keyPair;
  }

  getInternalKeyPair(index: number) {
    const keyPair = this.jsWallet.derivePath(
      `${this.derivationPath}/1/${index}`,
    );
    keyPair.network = this.network;
    return keyPair;
  }

  getAddress(index: number = this.addresses.length) {
    info("PeachLiquidJSWallet - getAddress", index);

    if (this.addresses[index]) return this.addresses[index];

    const keyPair = this.getKeyPair(index);
    const { address } = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (address) this.addresses[index] = address;

    return address;
  }

  getInternalAddress(index: number = this.addresses.length + 1) {
    info("PeachLiquidJSWallet - getAddress", index);

    if (this.addresses[index]) return this.addresses[index];

    const keyPair = this.getInternalKeyPair(index);
    const p2wpkh = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (p2wpkh.address) this.addresses[index] = p2wpkh.address;

    return p2wpkh.address;
  }

  findKeyPairByAddress(address: string) {
    info("PeachLiquidJSWallet - findKeyPairByAddress - start");

    const limit = this.addresses.length + this.gapLimit;
    for (let i = 0; i <= limit; i++) {
      info("PeachLiquidJSWallet - findKeyPairByAddress - scanning", i);

      const candidate = this.getAddress(i);
      if (address === candidate) {
        useWalletState.getState().setAddresses(this.addresses);
        return this.getKeyPair(i);
      }
    }

    useWalletState.getState().setAddresses(this.addresses);
    return null;
  }

  signMessage(message: string, address: string, index?: number) {
    info("PeachLiquidJSWallet - signMessage - start");

    const keyPair =
      index !== undefined
        ? this.getKeyPair(index)
        : this.findKeyPairByAddress(address);
    if (!keyPair?.privateKey) throw Error("Address not part of wallet");

    const signature = Signer.sign(
      keyPair.toWIF(),
      address,
      message,
      this.network,
    );

    info("PeachLiquidJSWallet - signMessage - end");

    return signature.toString("base64");
  }
}
