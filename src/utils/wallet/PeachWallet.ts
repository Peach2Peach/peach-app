import { DocumentDirectoryPath, exists } from "@dr.pogodin/react-native-fs";
import { NETWORK } from "@env";
import type {
  AddressInfo,
  PersisterInterface,
  Psbt,
  TxBuilderInterface,
  WalletInterface,
} from "bdk-rn";
import {
  BumpFeeTxBuilder,
  ElectrumClient,
  KeychainKind,
  Persister,
  Wallet,
} from "bdk-rn";
import { BIP32Interface } from "bip32";
import { sign } from "bitcoinjs-message";
import { Platform } from "react-native";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { getSummariesForWalletQuery } from "../../hooks/query/useOfferSummaries";
import { queryClient } from "../../queryClient";
import { waitForHydration } from "../../store/waitForHydration";
import { error } from "../log/error";
import { info } from "../log/info";
import { parseError } from "../parseError";
import { callWhenInternet } from "../web/callWhenInternet";
import {
  AddressIndex,
  BlockChainNames,
  bdkNetwork,
  bytesToHex,
  canonicalTxToWalletTx,
  transactionToInner,
  type WalletTx,
} from "./bdkShim";
import {
  buildBlockchainConfig,
  type BlockchainClient,
} from "./buildBlockchainConfig";
import { handleTransactionError } from "./error/handleTransactionError";
import { getDescriptorsBySeedphrase } from "./getDescriptorsBySeedphrase";
import { getUTXOAddress } from "./getUTXOAddress";
import { labelAddressByTransaction } from "./labelAddressByTransaction";
import { mapTransactionToOffer } from "./mapTransactionToOffer";
import { NodeConfig, useNodeConfigState } from "./nodeConfigStore";
import { BuildTxParams, buildTransaction } from "./transaction";
import { transactionHasBeenMappedToOffers } from "./transactionHasBeenMappedToOffers";
import { useWalletState } from "./walletStore";

const MIN_VERSION_FOR_SQLITE = 16;
const DEFAULT_STOP_GAP = BigInt(25);
const DEFAULT_BATCH_SIZE = BigInt(25);
const DEFAULT_PARALLEL_REQUESTS = BigInt(10);

function getDbPaths(network: string, nodeType: BlockChainNames) {
  const useMemory =
    Platform.OS === "ios" &&
    parseInt(Platform.Version as string, 10) < MIN_VERSION_FOR_SQLITE;
  const legacyName = `peach-${network}${nodeType}`;
  return {
    useMemory,
    legacyPath: `${DocumentDirectoryPath}/${legacyName}`,
    sqlitePath: `${DocumentDirectoryPath}/${legacyName}.sqlite`,
  };
}

async function migrateFromPreV1(
  wallet: WalletInterface,
  persister: PersisterInterface,
  legacyPath: string | undefined,
): Promise<boolean> {
  if (!legacyPath) return false;
  try {
    if (!(await exists(legacyPath))) return false;
  } catch {
    return false;
  }

  let legacyPersister: PersisterInterface;
  try {
    legacyPersister = Persister.newSqlite(legacyPath);
  } catch {
    return false;
  }

  let keychains;
  try {
    keychains = legacyPersister.getPreV1WalletKeychains();
  } catch {
    return false;
  }
  if (!keychains?.length) return false;

  for (const kc of keychains) {
    if (wallet.descriptorChecksum(kc.keychain) !== kc.checksum) {
      throw new Error(`pre-v1 migration: checksum mismatch on ${kc.keychain}`);
    }
  }

  for (const kc of keychains) {
    wallet.revealAddressesTo(kc.keychain, kc.lastDerivationIndex);
  }
  wallet.persist(persister);
  return true;
}

export class PeachWallet {
  initialized: boolean;

  seedphrase: string | undefined;

  syncInProgress: Promise<void> | undefined;

  balance: number;

  transactions: WalletTx[];

  wallet: WalletInterface | undefined;

  persister: PersisterInterface | undefined;

  client: BlockchainClient | undefined;

  gapLimit: number = 25;

  hasScanned: boolean = false;

  lastUnusedAddress?: Omit<AddressInfo, "address"> & { address: string };
  lastUnusedAddressInternal?: Omit<AddressInfo, "address"> & {
    address: string;
  };

  nodeType?: BlockChainNames;

  jsWallet: BIP32Interface;

  constructor({ wallet }: { wallet: BIP32Interface }) {
    this.jsWallet = wallet;
    this.balance = 0;
    this.transactions = [];
    this.initialized = false;
    this.syncInProgress = undefined;
    this.seedphrase = undefined;
  }

  async initWallet(seedphrase = this.seedphrase): Promise<void> {
    await waitForHydration(useWalletState);
    this.transactions = useWalletState.getState().transactions;
    this.balance = useWalletState.getState().balance;
    this.hasScanned = useWalletState.getState().hasScanned;

    return new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        info("PeachWallet - initWallet - start");

        try {
          const { externalDescriptor, internalDescriptor } =
            getDescriptorsBySeedphrase({
              seedphrase,
              network: NETWORK,
            });

          this.setBlockchain(useNodeConfigState.getState());

          const nodeType = this.nodeType || BlockChainNames.Esplora;
          const { useMemory, legacyPath, sqlitePath } = getDbPaths(
            NETWORK,
            nodeType,
          );

          info("PeachWallet - initWallet - createPersister");
          this.persister = useMemory
            ? Persister.newInMemory()
            : Persister.newSqlite(sqlitePath);

          info("PeachWallet - initWallet - createWallet");
          try {
            this.wallet = Wallet.load(
              externalDescriptor,
              internalDescriptor,
              this.persister,
            );
          } catch {
            this.wallet = new Wallet(
              externalDescriptor,
              internalDescriptor,
              bdkNetwork(NETWORK),
              this.persister,
            );
            this.hasScanned = false;
            useWalletState.getState().setHasScanned(false);

            if (!useMemory) {
              try {
                await migrateFromPreV1(this.wallet, this.persister, legacyPath);
              } catch (e) {
                error("PeachWallet - pre-v1 migration failed", parseError(e));
              }
            }
          }

          info("PeachWallet - initWallet - createdWallet");

          this.initialized = true;

          info("PeachWallet - initWallet - loaded");
          return resolve();
        } catch (e) {
          error("PeachWallet - initWallet - error", parseError(e));
          return reject(new Error("GENERAL_ERROR"));
        }
      }),
    );
  }

  async loadWallet(seedphrase?: string) {
    this.seedphrase = seedphrase;
    info("PeachWallet - loadWallet - start");
    await waitForHydration(useNodeConfigState);

    this.initWallet(seedphrase).then(() => {
      info("PeachWallet - loadWallet - finished");
    });
  }

  setBlockchain(nodeConfig: NodeConfig) {
    info("PeachWallet - setBlockchain - start");
    const built = buildBlockchainConfig(nodeConfig);
    this.client = built.client;
    this.nodeType = built.type;
    this.gapLimit = built.gapLimit;
  }

  syncWallet() {
    if (this.syncInProgress) return this.syncInProgress;

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.client || !this.persister)
          return reject(new Error("WALLET_NOT_READY"));

        info("PeachWallet - syncWallet - start");

        try {
          const wallet = this.wallet;
          const client = this.client;
          const persister = this.persister;

          info("PeachWallet - syncWallet - full scan start");
          const fullScanRequest = wallet.startFullScan().build();
          const update =
            client instanceof ElectrumClient
              ? await client.fullScan(
                  fullScanRequest,
                  BigInt(this.gapLimit),
                  DEFAULT_BATCH_SIZE,
                  false,
                )
              : await client.fullScan(
                  fullScanRequest,
                  BigInt(this.gapLimit),
                  DEFAULT_PARALLEL_REQUESTS,
                );
          wallet.applyUpdate(update);
          wallet.persist(persister);
          if (!this.hasScanned) {
            this.hasScanned = true;
            useWalletState.getState().setHasScanned(true);
          }

          const balance = wallet.balance();
          this.balance = Number(balance.total.toSat());
          useWalletState.getState().setBalance(this.balance);

          const canonicals = wallet.transactions();
          info(`PeachWallet - syncWallet - found ${canonicals.length} txs`);
          this.transactions = canonicals
            .map((canonical) => {
              try {
                const sr = wallet.sentAndReceived(canonical.transaction);
                let fee: bigint | undefined;
                try {
                  fee = wallet.calculateFee(canonical.transaction).toSat();
                } catch {
                  fee = undefined;
                }
                return canonicalTxToWalletTx(
                  canonical,
                  sr.sent.toSat(),
                  sr.received.toSat(),
                  fee,
                );
              } catch (e) {
                error(
                  "PeachWallet - syncWallet - tx map failed",
                  parseError(e),
                );
                return undefined;
              }
            })
            .filter((tx): tx is WalletTx => tx !== undefined);
          useWalletState.getState().setTransactions(this.transactions);

          const { offers, contracts } = await queryClient.fetchQuery({
            queryKey: offerKeys.summariesForWallet(),
            queryFn: getSummariesForWalletQuery,
          });
          this.transactions
            .filter((tx) => !transactionHasBeenMappedToOffers(tx))
            .forEach(mapTransactionToOffer({ offers, contracts }));
          this.transactions
            .filter(transactionHasBeenMappedToOffers)
            .forEach(labelAddressByTransaction);

          this.lastUnusedAddress = undefined;
          this.lastUnusedAddressInternal = undefined;
          info("PeachWallet - syncWallet - synced");

          this.syncInProgress = undefined;
          return resolve();
        } catch (e) {
          this.syncInProgress = undefined;
          error(parseError(e));
          return reject(new Error(parseError(e)));
        }
      }),
    );
    return this.syncInProgress;
  }

  getAddress(
    index: AddressIndex | number = AddressIndex.New,
    keychain: "internal" | "external" = "external",
    reveal: boolean = false,
  ) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    info("Getting address at index ", index);

    const kind =
      keychain === "external" ? KeychainKind.External : KeychainKind.Internal;
    const addressInfo = this.resolveAddress(kind, index, reveal);

    if (this.persister) this.wallet.persist(this.persister);
    return addressInfo;
  }

  private resolveAddress(
    keychain: KeychainKind,
    index: AddressIndex | number,
    reveal: boolean,
  ) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const shouldReveal = reveal && keychain === KeychainKind.External;
    const commitIndex = (target: number) => {
      if (!shouldReveal || !this.wallet) return;
      this.wallet.revealAddressesTo(keychain, target);
      this.wallet.markUsed(keychain, target);
      useWalletState.getState().markExternalIndexUsed(target);
    };
    if (typeof index === "number") {
      if (index < 0) throw new Error("INVALID_ADDRESS_INDEX");
      commitIndex(index);
      const addressInfo = this.wallet.peekAddress(keychain, index);
      return {
        index: addressInfo.index,
        keychain: addressInfo.keychain,
        address: addressInfo.address.toString(),
      };
    }
    if (index === AddressIndex.LastUnused) {
      const nextIndex = this.wallet.nextDerivationIndex(keychain);
      commitIndex(nextIndex);
      const addressInfo = this.wallet.peekAddress(keychain, nextIndex);
      return {
        index: addressInfo.index,
        keychain: addressInfo.keychain,
        address: addressInfo.address.toString(),
      };
    }
    const addressInfo = this.wallet.revealNextAddress(keychain);
    if (shouldReveal) {
      this.wallet.markUsed(keychain, addressInfo.index);
      useWalletState.getState().markExternalIndexUsed(addressInfo.index);
    }
    return {
      index: addressInfo.index,
      keychain: addressInfo.keychain,
      address: addressInfo.address.toString(),
    };
  }

  async getAddressByIndex(index: number) {
    const address = this.getAddress(index);

    return {
      index,
      used: this.isAddressUsed(index),
      address: address.address,
    };
  }

  private isAddressUsed(index: number): boolean {
    if (!this.wallet) return false;

    if (useWalletState.getState().externalUsedIndices.includes(index)) {
      return true;
    }

    const targetScript = bytesToHex(
      this.wallet
        .peekAddress(KeychainKind.External, index)
        .address.scriptPubkey()
        .toBytes(),
    );

    return this.wallet.transactions().some((canonical) =>
      canonical.transaction.output().some((out) => {
        try {
          return bytesToHex(out.scriptPubkey.toBytes()) === targetScript;
        } catch {
          return false;
        }
      }),
    );
  }

  async getLastUnusedAddressInternal() {
    if (!this.lastUnusedAddressInternal) {
      this.lastUnusedAddressInternal = this.getInternalAddress(
        AddressIndex.LastUnused,
      );
    }
    return this.lastUnusedAddressInternal;
  }

  async getLastUnusedAddress() {
    if (!this.lastUnusedAddress) {
      this.lastUnusedAddress = this.getAddress(AddressIndex.LastUnused);
    }
    return this.lastUnusedAddress;
  }

  getInternalAddress(index: AddressIndex | number = AddressIndex.New) {
    return this.getAddress(index, "internal");
  }

  async getAddressUTXO(address: string) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    const utxos = this.wallet.listUnspent();
    const getAddr = getUTXOAddress(bdkNetwork(NETWORK));
    return utxos.filter((utxo) => getAddr(utxo) === address);
  }

  async buildFinishedTransaction(buildParams: BuildTxParams) {
    if (!this.wallet || !this.client) throw Error("WALLET_NOT_READY");
    info("PeachWallet - buildFinishedTransaction - start");

    const transaction = await buildTransaction(buildParams);

    return this.finishTransaction(transaction);
  }

  async finishTransaction(
    transaction: TxBuilderInterface | BumpFeeTxBuilder,
  ): Promise<Psbt> {
    if (!this.wallet || !this.client) throw Error("WALLET_NOT_READY");
    info("PeachWallet - finishTransaction - start");
    try {
      return transaction.finish(this.wallet) as Psbt;
    } catch (e) {
      throw handleTransactionError(e);
    }
  }

  async signAndBroadcastPSBT(psbt: Psbt) {
    if (!this.wallet || !this.client) throw Error("WALLET_NOT_READY");
    info("PeachWallet - signAndBroadcastPSBT - start");
    try {
      this.wallet.sign(psbt, undefined);
      info("PeachWallet - signAndBroadcastPSBT - signed");

      const tx = psbt.extractTx();
      if (this.client instanceof ElectrumClient) {
        this.client.transactionBroadcast(tx);
      } else {
        this.client.broadcast(tx);
      }
      info("PeachWallet - signAndBroadcastPSBT - broadcasted");

      this.syncWallet().catch((e) => {
        error(parseError(e));
      });

      info("PeachWallet - signAndBroadcastPSBT - end");

      return psbt;
    } catch (e) {
      throw handleTransactionError(e);
    }
  }

  signMessage(message: string, index: number) {
    const keyPair = this.jsWallet.derivePath(
      `m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'/0/${index}`,
    );
    if (!keyPair.privateKey) throw Error("Private key not found");
    return sign(message, keyPair.privateKey, true).toString("base64");
  }

  walletTxFromSignedPsbt(signedPsbt: Psbt): WalletTx {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const tx = signedPsbt.extractTx();
    const inner = transactionToInner(tx);
    const sr = this.wallet.sentAndReceived(tx);
    let fee: number | undefined;
    try {
      fee = Number(signedPsbt.fee());
    } catch {
      fee = undefined;
    }
    return {
      txid: inner.id,
      sent: Number(sr.sent.toSat()),
      received: Number(sr.received.toSat()),
      fee,
      transaction: inner,
    };
  }
}
