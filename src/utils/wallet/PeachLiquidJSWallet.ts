import { BIP32Interface } from "bip32";
import { Signer } from "bip322-liquid-js";
import * as liquid from "liquidjs-lib";
import { Transaction } from "../../../peach-api/src/@types/electrs-liquid";
import { getAddressTxs } from "../liquid/getAddressTxs";
import { error } from "../log/error";
import { info } from "../log/info";
import { sum } from "../math/sum";
import { parseError } from "../parseError";
import { callWhenInternet } from "../web/callWhenInternet";
import { toUTXO } from "./liquid/toUTXO";
import { UTXOWithPath, useLiquidWalletState } from "./useLiquidWalletState";

const getAddressHistory = async (address: string, derivationPath: string) => {
  const result = await getAddressTxs({ address });

  if (!result.result) return { utxo: [], txs: [] };

  return {
    utxo: toUTXO(result.result, address)
      .filter((utxo) => utxo.value)
      .map((utxo) => ({ ...utxo, derivationPath })),
    txs: result.result,
  };
};

type PeachLiquidJSWalletProps = {
  wallet: BIP32Interface;
  network?: liquid.networks.Network;
  gapLimit?: number;
  concurrency?: number;
};

const DEFAULT = {
  GAP_LIMIT: 15,
  CONCURRENCY: 1,
};
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
    concurrency = DEFAULT.CONCURRENCY,
  }: PeachLiquidJSWalletProps) {
    this.jsWallet = wallet;
    this.network = network;
    this.gapLimit = gapLimit;
    this.concurrency = concurrency;
    this.derivationPath = `m/84'/${network.name === liquid.networks.liquid.name ? "0" : "1"}'/0'`;
  }

  get addresses() {
    return useLiquidWalletState.getState().addresses;
  }

  isAddressUsed(address: string) {
    return !!useLiquidWalletState.getState().usedAddresses[address];
  }

  get internalAddresses() {
    return useLiquidWalletState.getState().internalAddresses;
  }

  get utxos() {
    return useLiquidWalletState.getState().utxos;
  }

  get transactions() {
    return useLiquidWalletState.getState().transactions;
  }

  syncWallet() {
    if (this.syncInProgress) return this.syncInProgress;

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        info("PeachLiquidJSWallet - syncWallet - start");
        useLiquidWalletState.getState().setIsSynced(false);

        try {
          let utxos: UTXOWithPath[] = [];
          let transactions: Transaction[] = [];

          let limit = Math.max(this.gapLimit, this.addresses.length);
          for (let i = 0; i < limit; i++) {
            const { address } = this.getAddress(i, false);

            // eslint-disable-next-line no-await-in-loop
            const { utxo, txs } = await getAddressHistory(
              address,
              this.getExternalPath(i),
            );
            if (txs.length > 0) {
              useLiquidWalletState.getState().setAddressUsed(address);
              limit = i + this.gapLimit;
            }
            utxos = [...utxos, ...utxo];
            transactions = [...transactions, ...txs];
          }

          limit = Math.max(this.gapLimit, this.internalAddresses.length);
          for (let i = 0; i < limit; i++) {
            const { address } = this.getInternalAddress(i, false);
            // eslint-disable-next-line no-await-in-loop
            const { utxo, txs } = await getAddressHistory(
              address,
              this.getInternalPath(i),
            );
            if (txs.length > 0) {
              useLiquidWalletState.getState().setAddressUsed(address);
              limit = i + this.gapLimit;
            }
            utxos = [...utxos, ...utxo];
            transactions = [...transactions, ...txs];
          }

          useLiquidWalletState.getState().setUTXO(utxos);
          useLiquidWalletState.getState().setTransactions(transactions);
          const balance = this.getBalance();
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

  getBalance() {
    const confirmed = this.utxos
      .filter((utxo) => utxo.status.confirmed && utxo.value)
      .map((utxo) => utxo.value)
      .reduce(sum, 0);
    const pending = this.utxos
      .filter((utxo) => !utxo.status.confirmed)
      .map((utxo) => utxo.value)
      .reduce(sum, 0);
    const total = confirmed + pending;
    return {
      trustedPending: 0,
      untrustedPending: pending,
      confirmed,
      spendable: total,
      total,
    };
  }

  getExternalPath(index: number) {
    return `${this.derivationPath}/0/${index}`;
  }

  getInternalPath(index: number) {
    return `${this.derivationPath}/1/${index}`;
  }

  getKeyPairByPath(path: string) {
    const keyPair = this.jsWallet.derivePath(path);
    keyPair.network = this.network;
    return keyPair;
  }

  getKeyPair(index: number) {
    return this.getKeyPairByPath(this.getExternalPath(index));
  }

  getInternalKeyPair(index: number) {
    return this.getKeyPairByPath(this.getInternalPath(index));
  }

  getAddress(index: number = this.addresses.length, cache = true) {
    info("PeachLiquidJSWallet - getAddress", index);

    if (this.addresses[index])
      return {
        address: this.addresses[index],
        index,
      };

    const keyPair = this.getKeyPair(index);
    const { address } = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (!address) throw Error("ADDRESS_NOT_FOUND");

    if (cache) {
      const addresses = [...this.addresses];
      addresses[index] = address;
      useLiquidWalletState.getState().setAddresses(addresses);
    }

    return { address, index };
  }

  getInternalAddress(
    index: number = this.internalAddresses.length + 1,
    cache = true,
  ) {
    info("PeachLiquidJSWallet - getInternalAddress", index);

    if (this.internalAddresses[index])
      return {
        address: this.internalAddresses[index],
        index,
      };

    const keyPair = this.getInternalKeyPair(index);
    const { address } = liquid.payments.p2wpkh({
      network: this.network,
      pubkey: keyPair.publicKey,
    });

    if (address && cache) {
      const addresses = [...this.internalAddresses];
      addresses[index] = address;
      useLiquidWalletState.getState().setInternalAddresses(addresses);
    }

    if (!address) throw Error("ADDRESS_NOT_FOUND");

    return { address, index };
  }

  findKeyPairByAddress(address: string) {
    info("PeachLiquidJSWallet - findKeyPairByAddress - start");

    const limit = this.addresses.length + this.gapLimit;
    for (let i = 0; i <= limit; i++) {
      info("PeachLiquidJSWallet - findKeyPairByAddress - scanning", i);

      const { address: candidate } = this.getAddress(i);
      if (address === candidate) {
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
