/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this, require-await */
import { PartiallySignedTransaction } from "bdk-rn";
import {
  LocalUtxo,
  OutPoint,
  TransactionDetails,
  TxBuilderResult,
  TxOut,
} from "bdk-rn/lib/classes/Bindings";
import { Script } from "bdk-rn/lib/classes/Script";
import { KeychainKind, Network } from "bdk-rn/lib/lib/enums";
import { BIP32Interface } from "bip32";
import { getTransactionDetails } from "../../../../tests/unit/helpers/getTransactionDetails";

type PeachWalletProps = {
  network?: Network;
  wallet: BIP32Interface;
};
class PeachWallet {
  balance: number;

  transactions: TransactionDetails[];

  wallet: BIP32Interface;

  initialized = false;

  network: Network;

  constructor({ wallet, network = Network.Bitcoin }: PeachWalletProps) {
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

  async getTransactions(): Promise<TransactionDetails[]> {
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
    const outpoint = new OutPoint("txid", 0);
    const script = new Script("address");
    const value = 10000;
    const txout = new TxOut(value, script);
    return [new LocalUtxo(outpoint, txout, false, KeychainKind.External)];
  }

  async withdrawAll(): Promise<string | null> {
    return "txId";
  }

  async sendTo(
    address: string,
    amount: number,
    feeRate = 1,
  ): Promise<TxBuilderResult> {
    return getTransactionDetails(amount, feeRate);
  }

  async finishTransaction() {
    return getTransactionDetails();
  }

  async signAndBroadcastPSBT(psbt: PartiallySignedTransaction) {
    return psbt;
  }

  findKeyPairByAddress() {
    return undefined;
  }

  signMessage() {
    // message: I confirm that only I, peach02d13a5d, control the address bcrt1qwype5wug33a6hwz9u2n6vz4lc0kpw0kg4xc8fq
    return "IH9ZjMHG1af6puAITFTdV5RSYoK1MNmecZdhW0s4soh4EIAz4igtVQTec5yj4H9Iy7sB6qYReRjGpE3b4OoXSLY";
  }

  getNetwork() {
    return this.network;
  }
}

PeachWallet.prototype.syncWallet = jest.fn().mockResolvedValue(undefined);

export { PeachWallet };
