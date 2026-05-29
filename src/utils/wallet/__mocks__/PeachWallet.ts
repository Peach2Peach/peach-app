/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this, require-await */
import type { Psbt } from "bdk-rn";
import { BIP32Interface } from "bip32";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";
import type { WalletTx } from "../bdkShim";

type PeachWalletProps = {
  network?: string;
  wallet: BIP32Interface;
};
class PeachWallet {
  balance: number;

  transactions: WalletTx[];

  wallet: BIP32Interface;

  initialized = false;

  network: string;

  constructor({ wallet, network = "bitcoin" }: PeachWalletProps) {
    this.wallet = wallet;
    this.balance = 0;
    this.transactions = [];
    this.network = network;
  }

  async getLastUnusedAddress() {
    return {
      address: "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq",
      index: 0,
    };
  }

  async loadWallet() {}

  async initWallet() {}

  async setBlockchain() {}

  async syncWallet() {}

  updateStore(): void {}

  async getBalance(): Promise<number> {
    return 0;
  }

  async getTransactions(): Promise<WalletTx[]> {
    return [];
  }

  getPendingTransactions() {
    return this.transactions.filter((tx) => !tx.confirmationTime?.height);
  }

  async getReceivingAddress() {
    return {
      address: "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq",
      index: 0,
    };
  }

  async getAddress() {
    return {
      address: "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq",
      index: 0,
    };
  }

  async getInternalAddress() {
    return {
      address: "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq",
      index: 0,
    };
  }

  getAddressByIndex(index: number) {
    if (index === 0)
      return { address: "bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq", index };
    throw new Error("Address not found");
  }

  async getAddressUTXO() {
    return [];
  }

  async withdrawAll(): Promise<string | null> {
    return "txId";
  }

  async sendTo(
    _address: string,
    amount: number,
    feeRate = 1,
  ): Promise<WalletTx> {
    return getTransactionDetails(amount, feeRate);
  }

  async finishTransaction(): Promise<Psbt> {
    return {} as Psbt;
  }

  async signAndBroadcastPSBT(psbt: Psbt) {
    return psbt;
  }

  walletTxFromSignedPsbt(_psbt: Psbt): WalletTx {
    return getTransactionDetails();
  }

  findKeyPairByAddress() {
    return undefined;
  }

  signMessage() {
    return "IH9ZjMHG1af6puAITFTdV5RSYoK1MNmecZdhW0s4soh4EIAz4igtVQTec5yj4H9Iy7sB6qYReRjGpE3b4OoXSLY";
  }

  getNetwork() {
    return this.network;
  }
}

PeachWallet.prototype.syncWallet = jest.fn().mockResolvedValue(undefined);

export { PeachWallet };
