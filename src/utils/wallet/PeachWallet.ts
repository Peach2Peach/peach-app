import { DocumentDirectoryPath } from "@dr.pogodin/react-native-fs";
import { NETWORK } from "@env";
import {
  AddressInfo,
  BumpFeeTxBuilder,
  ElectrumClient,
  EsploraClient,
  KeychainKind,
  Network,
  Persister,
  Psbt,
  TxBuilder,
  TxDetails,
  UpdateInterface,
  Wallet,
  WalletInterface,
} from "bdk-rn";
import { BIP32Interface } from "bip32";
import { sign } from "bitcoinjs-message";
import { Platform } from "react-native";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { getContractSummariesQuery } from "../../hooks/query/useContractSummaries";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { getOfferSummariesQuery } from "../../hooks/query/useOfferSummaries";
import { queryClient } from "../../queryClient";
import { waitForHydration } from "../../store/waitForHydration";
import { convertBitcoinNetworkToBDKNetwork } from "../bitcoin/convertBitcoinNetworkToBDKNetwork";
import { error } from "../log/error";
import { info } from "../log/info";
import { parseError } from "../parseError";
import { addProtocol } from "../web/addProtocol";
import { callWhenInternet } from "../web/callWhenInternet";
import { BlockChainNames } from "./BlockChainNames";
import { handleTransactionError } from "./error/handleTransactionError";
import { getDescriptorsBySeedphrase } from "./getDescriptorsBySeedphrase";
import { getUTXOAddress } from "./getUTXOAddress";
import { labelAddressByTransaction } from "./labelAddressByTransaction";
import { mapTransactionToOffer } from "./mapTransactionToOffer";
import { NodeConfig, useNodeConfigState } from "./nodeConfigStore";
import { BuildTxParams, buildTransaction } from "./transaction";
import { transactionHasBeenMappedToOffers } from "./transactionHasBeenMappedToOffers";
import { useWalletState } from "./walletStore";

export class PeachWallet {
  initialized: boolean;

  seedphrase: string | undefined;

  syncInProgress: Promise<void> | undefined;

  balance: number;

  transactions: TxDetails[];

  wallet: WalletInterface | undefined;

  lastUnusedAddress?: Omit<AddressInfo, "address"> & {
    address: string;
  };

  blockchain: EsploraClient | ElectrumClient | undefined;
  esploraClient: EsploraClient | undefined;
  electrumClient: ElectrumClient | undefined;

  nodeType?: BlockChainNames;

  jsWallet: BIP32Interface;

  hasEverBeenFullySynced?: boolean;

  constructor({ wallet }: { wallet: BIP32Interface }) {
    this.jsWallet = wallet;
    this.balance = 0;
    this.transactions = [];
    this.initialized = false;
    this.syncInProgress = undefined;
    this.seedphrase = undefined;
    this.hasEverBeenFullySynced = false;
  }

  async initWallet(seedphrase = this.seedphrase): Promise<void> {
    await waitForHydration(useWalletState);
    this.transactions = useWalletState.getState().transactions;
    this.balance = useWalletState.getState().balance;

    return new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        info("PeachWallet - initWallet - start");

        try {
          const { externalDescriptor, internalDescriptor } =
            await getDescriptorsBySeedphrase({
              seedphrase,
              network: convertBitcoinNetworkToBDKNetwork(NETWORK),
            });
          this.setBlockchain(useNodeConfigState.getState());

          console.log("TODO: FIX THIS, REMOVE THIS");
          this.nodeType = BlockChainNames.Esplora;

          const dbConfig = getDBConfig(
            convertBitcoinNetworkToBDKNetwork(NETWORK),
            this.nodeType,
          );
          info("PeachWallet - initWallet - createWallet");

          //TODO: MAKE THIS FLEXIBLE
          console.log("WARNING!!! ONLY LOADING");
          this.wallet = Wallet.load(
            externalDescriptor,
            internalDescriptor,
            dbConfig,
          );
          // this.wallet = new Wallet(
          //   externalDescriptor,
          //   internalDescriptor,
          //   convertBitcoinNetworkToBDKNetwork(NETWORK),
          //   dbConfig,
          // );
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

  async setBlockchain(nodeConfig: NodeConfig) {
    info("PeachWallet - setBlockchain - start");
    console.log("Node config", nodeConfig);

    //TODO:!!!! DELETE THIS AND FIX THE BUG
    console.log("DELETE THIS AFTER FIX");
    nodeConfig.type = BlockChainNames.Esplora;
    nodeConfig.url = "http://localhost:5500";

    if (nodeConfig.type === undefined) {
      throw Error("No blockchain type");
    }
    if (nodeConfig.url === undefined) {
      throw Error("No blockchain url");
    }

    if (nodeConfig.type === BlockChainNames.Esplora) {
      const newEsploraClient = new EsploraClient(
        addProtocol(nodeConfig.url, nodeConfig.ssl ? "https" : "http"),
      );

      this.blockchain = newEsploraClient;
      this.esploraClient = newEsploraClient;
      this.nodeType = BlockChainNames.Esplora;
    } else if (nodeConfig.type === BlockChainNames.Electrum) {
      const newElectrumClient = new ElectrumClient(
        addProtocol(nodeConfig.url, nodeConfig.ssl ? "ssl" : "tcp"),
      );
      this.blockchain = newElectrumClient;
      this.electrumClient = newElectrumClient;
      this.nodeType = BlockChainNames.Electrum;
    }
  }

  syncWallet() {
    if (this.syncInProgress) return this.syncInProgress;

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain)
          return reject(new Error("WALLET_NOT_READY"));

        info("PeachWallet - syncWallet - start");

        try {
          let walletUpdate: UpdateInterface;

          if (this.hasEverBeenFullySynced) {
            const syncBuilder = this.wallet.startSyncWithRevealedSpks();
            const syncRequest = syncBuilder.build();
            walletUpdate = this.blockchain.sync(
              syncRequest,
              BigInt(100),
              false,
            );
          } else {
            const fullScanBuilder = this.wallet.startFullScan();
            const fullScanRequest = fullScanBuilder.build();

            walletUpdate = this.blockchain.fullScan(
              fullScanRequest,
              BigInt(100),
              BigInt(10),
              true,
            );
          }

          this.wallet.applyUpdate(walletUpdate);

          this.hasEverBeenFullySynced = true;

          const balance = this.wallet.balance();
          this.balance = Number(balance.total.toSat());
          useWalletState.getState().setBalance(this.balance);

          const walletTransactions = this.wallet.transactions().map((x) => {
            const details = this.wallet?.txDetails(x.transaction);
            if (details === undefined) {
              throw new Error("txDetails returned undefined");
            }
            return details;
          });

          this.transactions = walletTransactions;
          useWalletState.getState().setTransactions(this.transactions);
          const offers = await queryClient.fetchQuery({
            queryKey: offerKeys.summaries(),
            queryFn: getOfferSummariesQuery,
          });
          const contracts = await queryClient.fetchQuery({
            queryKey: contractKeys.summaries(),
            queryFn: getContractSummariesQuery,
          });
          this.transactions
            .filter((tx) => !transactionHasBeenMappedToOffers(tx))
            .forEach(mapTransactionToOffer({ offers, contracts }));
          this.transactions
            .filter(transactionHasBeenMappedToOffers)
            .forEach(labelAddressByTransaction);

          this.lastUnusedAddress = undefined;
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

  async getAddress(index: number = 0) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    info("Getting address at index ", index);

    let addressInfo: AddressInfo;
    if (index === 0) {
      addressInfo = this.wallet.nextUnusedAddress(KeychainKind.Internal);
    } else {
      addressInfo = this.wallet.peekAddress(KeychainKind.Internal, index);
    }

    return {
      ...addressInfo,
      address: addressInfo.address.toQrUri(),
    };
  }

  async getAddressByIndex(index: number) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress();
    const address = this.wallet?.peekAddress(KeychainKind.Internal, index);
    return {
      index,
      used: index < lastUnusedIndex,
      address: address.address.toQrUri(),
    };
  }

  async getLastUnusedAddress() {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    if (!this.lastUnusedAddress) {
      const unusedAddresses = this.wallet?.listUnusedAddresses(
        KeychainKind.Internal,
      );

      const lastUnusedAddress =
        unusedAddresses.length === 0
          ? this.wallet.revealNextAddress(KeychainKind.Internal)
          : unusedAddresses[unusedAddresses.length - 1];

      this.lastUnusedAddress = {
        ...lastUnusedAddress,
        address: lastUnusedAddress.address.toQrUri(),
      };
    }
    return this.lastUnusedAddress;
  }

  async getInternalAddress(index: number = 0) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    let addressInfo: AddressInfo;
    if (index === 0) {
      addressInfo = this.wallet.nextUnusedAddress(KeychainKind.Internal);
    } else {
      addressInfo = this.wallet.peekAddress(KeychainKind.Internal, index);
    }

    return {
      ...addressInfo,
      address: addressInfo.address.toQrUri(),
    };
  }

  async getAddressUTXO(address: string) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    const utxo = this.wallet.listUnspent();
    const utxoAddresses = utxo.map(
      getUTXOAddress(convertBitcoinNetworkToBDKNetwork(NETWORK)),
    );

    return utxo.filter((utx, i) => utxoAddresses[i] === address);
  }

  async buildFinishedTransaction(buildParams: BuildTxParams) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - buildFinishedTransaction - start");

    const transaction = await buildTransaction(buildParams);

    return this.finishTransaction(transaction);
  }

  async finishTransaction<T extends TxBuilder | BumpFeeTxBuilder>(
    transaction: T,
  ): Promise<ReturnType<T["finish"]>>;

  async finishTransaction(transaction: TxBuilder | BumpFeeTxBuilder) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - finishTransaction - start");
    try {
      return transaction.finish(this.wallet);
    } catch (e) {
      throw handleTransactionError(parseError(e));
    }
  }

  async signAndBroadcastPSBT(psbt: Psbt) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - signAndBroadcastPSBT - start");
    try {
      const wasFinalized = this.wallet.sign(psbt);
      if (!wasFinalized) throw Error("Signed Transaction was not finalized");

      info("PeachWallet - signAndBroadcastPSBT - signed");
      if (this.esploraClient) {
        this.esploraClient.broadcast(psbt.extractTx());
      } else if (this.electrumClient) {
        this.electrumClient.transactionBroadcast(psbt.extractTx());
      }

      info("PeachWallet - signAndBroadcastPSBT - broadcasted");

      this.syncWallet().catch((e) => {
        error(parseError(e));
      });

      info("PeachWallet - signAndBroadcastPSBT - end");

      return psbt;
    } catch (e) {
      throw handleTransactionError(parseError(e));
    }
  }

  signMessage(message: string, index: number) {
    const keyPair = this.jsWallet.derivePath(
      `m/84'/${NETWORK === "bitcoin" ? "0" : "1"}'/0'/0/${index}`,
    );
    if (!keyPair.privateKey) throw Error("Private key not found");
    return sign(message, keyPair.privateKey, true).toString("base64");
  }
}

const MIN_VERSION_FOR_SQLITE = 16;
function getDBConfig(
  network: Network,
  nodeType: BlockChainNames = BlockChainNames.Electrum,
) {
  if (
    Platform.OS === "ios" &&
    parseInt(Platform.Version, 10) < MIN_VERSION_FOR_SQLITE
  ) {
    return Persister.newInMemory();
  }
  const dbName = `peach-${network}${nodeType}`;
  const directory = `${DocumentDirectoryPath}/${dbName}_new.sqlite3`;
  return Persister.newSqlite(directory);
}
