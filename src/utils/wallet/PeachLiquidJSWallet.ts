import { BIP32Interface } from "bip32";
import { Signer } from "bip322-liquid-js";
import * as liquid from "liquidjs-lib";
import { getUTXO } from "../liquid/getUTXO";
import { error } from "../log/error";
import { info } from "../log/info";
import { sum } from "../math/sum";
import { parseError } from "../parseError";
import { isDefined } from "../validation/isDefined";
import { callWhenInternet } from "../web/callWhenInternet";
import { useLiquidWalletState } from "./useLiquidWalletState";

type PeachLiquidJSWalletProps = {
  wallet: BIP32Interface;
  network?: liquid.networks.Network;
  gapLimit?: number;
  concurrency?: number
};

const DEFAULT = {
  GAP_LIMIT: 25,
  CONCURRENCY: 1
}
export class PeachLiquidJSWallet {
  jsWallet: BIP32Interface;

  network: liquid.networks.Network;

  derivationPath: string;

  gapLimit: number;

  concurrency: number;

  syncInProgress: Promise<void> | undefined;

  constructor({
    wallet,
    network = liquid.networks.liquid,
    gapLimit = DEFAULT.GAP_LIMIT,
    concurrency = DEFAULT.CONCURRENCY
  }: PeachLiquidJSWalletProps) {
    this.jsWallet = wallet;
    this.network = network;
    this.gapLimit = gapLimit;
    this.concurrency = concurrency;
    this.derivationPath = `m/49'/${network === liquid.networks.liquid ? "0" : "1"}'/0'`;
  }

  get addresses() {
    return useLiquidWalletState.getState().addresses
  }

  get internalAddresses() {
    return useLiquidWalletState.getState().internalAddresses
  }

  get utxos() {
    return useLiquidWalletState.getState().utxos
  }

  syncWallet() {
    if (this.syncInProgress) return this.syncInProgress;

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        info("PeachLiquidJSWallet - syncWallet - start");
        useLiquidWalletState.getState().setIsSynced(false);

        try {
          const limit = this.gapLimit
          let utxos: UTXO[] = []
          for (let i = 0; i < limit; i++) {
            const { address } = this.getAddress(i)
            const { address: internalAddress } = this.getInternalAddress(i)
            // eslint-disable-next-line no-await-in-loop
            const [result, resultInternal] = await Promise.all([address, internalAddress]
              .filter(isDefined)
              .map(addr => getUTXO({ address: addr })))
            if (result.result) utxos = [...utxos, ...result.result]
            if (resultInternal.result) utxos = [...utxos, ...resultInternal.result]
          }
          const balance = this.getBalance();
          useLiquidWalletState.getState().setUTXO(utxos)
          useLiquidWalletState.getState().setBalance(balance.total);
          useLiquidWalletState.getState().setIsSynced(true);
  
          this.syncInProgress = undefined;
          return resolve();
        } catch (e) {
          error(parseError(e));
          return reject(new Error(parseError(e)));
        }
      }),
    );
    return this.syncInProgress;
  }

  // TODO values can be blinded
  // TODO does not yet consider other assets
  getBalance() {
    const confirmed = this.utxos.filter(utxo => utxo.status.confirmed).map(utxo => utxo.value).reduce(sum, 0)
    const pending = this.utxos.filter(utxo => !utxo.status.confirmed).map(utxo => utxo.value).reduce(sum, 0)
    const total = confirmed + pending
    return {
      trustedPending: 0,
      untrustedPending: pending,
      confirmed,
      spendable: total,
      total,
    }
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

    if (this.addresses[index]) return {
      address: this.addresses[index],
      index
    };

    const keyPair = this.getKeyPair(index);
    const { address } = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (address) {
      const addresses = [...this.addresses]
      addresses[index] = address;
      useLiquidWalletState.getState().setAddresses(addresses)
    }

    return { address, index };
  }

  getInternalAddress(index: number = this.internalAddresses.length + 1) {
    info("PeachLiquidJSWallet - getAddress", index);

    if (this.internalAddresses[index]) return {
      address: this.internalAddresses[index],
      index,
    }

    const keyPair = this.getInternalKeyPair(index);
    const p2wpkh = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (p2wpkh.address) this.internalAddresses[index] = p2wpkh.address;

    return { address: p2wpkh.address, index };
  }

  findKeyPairByAddress(address: string) {
    info("PeachLiquidJSWallet - findKeyPairByAddress - start");

    const limit = this.addresses.length + this.gapLimit;
    for (let i = 0; i <= limit; i++) {
      info("PeachLiquidJSWallet - findKeyPairByAddress - scanning", i);

      const { address: candidate } = this.getAddress(i);
      if (address === candidate) {
        useLiquidWalletState.getState().setAddresses(this.addresses);
        return this.getKeyPair(i);
      }
    }

    useLiquidWalletState.getState().setAddresses(this.addresses);
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
