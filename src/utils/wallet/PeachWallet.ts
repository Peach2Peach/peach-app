import {
  DocumentDirectoryPath,
  LibraryDirectoryPath,
  copyFile,
  exists,
  mkdir,
  readDir,
} from "@dr.pogodin/react-native-fs";
import { NETWORK } from "@env";
import {
  AddressInfo,
  BumpFeeTxBuilder,
  ElectrumClient,
  EsploraClient,
  KeychainKind,
  LoadWithPersistError,
  Network,
  Persister,
  PersisterInterface,
  PsbtInterface,
  TxBuilderInterface,
  UpdateInterface,
  Wallet,
  WalletInterface,
} from "bdk-rn";

import { BIP32Interface } from "bip32";
import { sign } from "bitcoinjs-message";
import { Platform } from "react-native";
import SQLite from "react-native-sqlite-storage";
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
import { buildBlockchainConfig } from "./buildBlockchainConfig";
import { handleTransactionError } from "./error/handleTransactionError";
import { getDescriptorsBySeedphrase } from "./getDescriptorsBySeedphrase";
import { getUTXOAddress } from "./getUTXOAddress";
import { labelAddressByTransaction } from "./labelAddressByTransaction";
import { mapTransactionToOffer } from "./mapTransactionToOffer";
import { NodeConfig, useNodeConfigState } from "./nodeConfigStore";
import { BuildTxParams, buildTransaction } from "./transaction";
import { transactionHasBeenMappedToOffers } from "./transactionHasBeenMappedToOffers";
import { txDetailsToWalletTransaction, useWalletState } from "./walletStore";
import { WalletTransaction } from "./WalletTransaction";
SQLite.enablePromise(true);
export class PeachWallet {
  initialized: boolean;

  seedphrase: string | undefined;

  syncInProgress: Promise<void> | undefined;

  balance: number;

  transactions: WalletTransaction[];

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
    console.log("async initWallet()");
    await waitForHydration(useWalletState);
    this.transactions = useWalletState.getState().transactions;
    this.balance = useWalletState.getState().balance;
    console.log("TRANSACTIONS", this.transactions);

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

          const {
            persister: dbConfig,
            latestDerivationIndex: latestDerivationIndexOfOldDB,
          } = await getDBConfig(
            convertBitcoinNetworkToBDKNetwork(NETWORK),
            this.nodeType,
          );
          info("PeachWallet - initWallet - createWallet");

          try {
            this.wallet = Wallet.load(
              externalDescriptor,
              internalDescriptor,
              dbConfig,
            );
          } catch (e) {
            if (LoadWithPersistError.instanceOf(e)) {
              this.wallet = new Wallet(
                externalDescriptor,
                internalDescriptor,
                convertBitcoinNetworkToBDKNetwork(NETWORK),
                dbConfig,
                latestDerivationIndexOfOldDB,
              );
            } else {
              throw e;
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
    console.log("async loadWallet()");
    this.seedphrase = seedphrase;
    info("PeachWallet - loadWallet - start");
    await waitForHydration(useNodeConfigState);

    this.initWallet(seedphrase).then(() => {
      info("PeachWallet - loadWallet - finished");
    });
  }

  async setBlockchain(nodeConfig: NodeConfig) {
    console.log("async setBlockchain()");
    info("PeachWallet - setBlockchain - start");

    const blockchainConfig = buildBlockchainConfig(nodeConfig);

    //TODO BDK:!!!! DELETE THIS AND FIX THE BUG
    // console.log("DELETE THIS AFTER FIX");
    // nodeConfig.type = BlockChainNames.Esplora;
    // nodeConfig.url = "http://localhost:30000";

    if (blockchainConfig.type === undefined) {
      throw Error("No blockchain type");
    }
    // if (blockchainConfig.config.url === undefined || ) {
    //   throw Error("No blockchain url");
    // }

    if (blockchainConfig.type === BlockChainNames.Esplora) {
      if (!("baseUrl" in blockchainConfig.config))
        throw Error("missing base url");
      const newEsploraClient = new EsploraClient(
        addProtocol(
          blockchainConfig.config.baseUrl,
          nodeConfig.ssl ? "https" : "http",
        ),
      );

      // newEsploraClient.getHeight();

      this.blockchain = newEsploraClient;

      this.esploraClient = newEsploraClient;
      this.nodeType = BlockChainNames.Esplora;
    } else if (blockchainConfig.type === BlockChainNames.Electrum) {
      if (!("url" in blockchainConfig.config))
        throw Error("missing url on electrum config");
      const newElectrumClient = new ElectrumClient(
        addProtocol(
          blockchainConfig.config.url,
          nodeConfig.ssl ? "ssl" : "tcp",
        ),
      );
      // newElectrumClient.ping();
      this.blockchain = newElectrumClient;
      this.electrumClient = newElectrumClient;
      this.nodeType = BlockChainNames.Electrum;
    }
  }

  async syncWallet() {
    console.log("async syncWallet()");
    if (this.syncInProgress) return this.syncInProgress;

    this.syncInProgress = new Promise((resolve, reject) =>
      callWhenInternet(async () => {
        if (!this.wallet || !this.blockchain)
          return reject(new Error("WALLET_NOT_READY"));

        info("PeachWallet - syncWallet - start");

        try {
          let walletUpdate: UpdateInterface;

          console.log("....");

          if (this.hasEverBeenFullySynced) {
            const syncBuilder = this.wallet.startSyncWithRevealedSpks();
            const syncRequest = syncBuilder.build();
            console.log("SHORT SYYYYYNC");
            console.log("1111....");
            walletUpdate = this.blockchain.sync(
              syncRequest,
              BigInt(100),
              false,
            );
          } else {
            const fullScanBuilder = this.wallet.startFullScan();
            const fullScanRequest = fullScanBuilder.build();
            console.log("2222....");

            walletUpdate = this.blockchain.fullScan(
              fullScanRequest,
              BigInt(100),
              BigInt(10),
              true,
            );

            console.log("3333....");
          }
          console.log("here....");
          this.wallet.applyUpdate(walletUpdate);
          console.log("othger side!!!....");
          this.hasEverBeenFullySynced = true;

          const balance = this.wallet.balance();
          console.log("MAZZZ 1....");
          const balanceNumber = Number(balance.total.toSat());
          this.balance = balanceNumber;
          console.log("MAZZZ 2....", balanceNumber);
          useWalletState.getState().setBalance(balanceNumber);

          console.log("MAZZZ 3....");

          const txDetailsArray = this.wallet.transactions().map((x) => {
            const details = this.wallet?.txDetails(x.transaction.computeTxid());
            console.log("coool");
            if (details === undefined) {
              throw new Error("txDetails returned undefined");
            }
            return details;
          });

          console.log("MAZZZ 4....");

          this.transactions = txDetailsArray.map((x) =>
            txDetailsToWalletTransaction(x),
          );
          console.log("MAZZZ 5....");

          useWalletState.getState().setTransactions(txDetailsArray);
          console.log("MAZZZ 6....");
          const offers = await queryClient.fetchQuery({
            queryKey: offerKeys.summaries(),
            queryFn: getOfferSummariesQuery,
          });
          console.log("MAZZZ 7....");
          const contracts = await queryClient.fetchQuery({
            queryKey: contractKeys.summaries(),
            queryFn: getContractSummariesQuery,
          });
          console.log("MAZZZ 8....");
          this.transactions
            .filter((tx) => !transactionHasBeenMappedToOffers(tx))
            .forEach(mapTransactionToOffer({ offers, contracts }));
          console.log("MAZZZ 9....");
          this.transactions
            .filter(transactionHasBeenMappedToOffers)
            .forEach(labelAddressByTransaction);

          console.log("MAZZZ 10....");
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
    console.log("async getAddress()");
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    info("Getting address at index ", index);

    let addressInfo: AddressInfo;
    if (index === 0) {
      addressInfo = this.wallet.revealNextAddress(KeychainKind.External);
    } else {
      const addressesRevealed = this.wallet.revealAddressesTo(
        KeychainKind.External,
        index,
      );
      addressInfo = addressesRevealed[addressesRevealed.length - 1];
    }

    const addressString = addressInfo.address
      .toQrUri()
      .replace("bitcoin:", "")
      .toLowerCase();

    return {
      ...addressInfo,
      address: addressString,
    };
  }

  async getAddressByIndex(index: number) {
    console.log("async getAddressByIndex()");
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress();
    // const { index: lastUnusedIndex } = await this.getLastUnusedAddress();
    // const addressesRevealed = this.wallet.revealAddressesTo(KeychainKind.External, index);
    // const address = addressesRevealed[addressesRevealed.length - 1]
    // const address = this.wallet?.peekAddress(KeychainKind.External, index);
    let nextIndex = this.wallet.nextDerivationIndex(KeychainKind.External);
    console.log("nextIndex", nextIndex, "cur index", index);
    let address;
    if (nextIndex === index) {
      console.log("exact!");
      console.log("222");
      address = this.wallet.revealNextAddress(KeychainKind.External);
    } else if (nextIndex > index) {
      console.log("older address, lets peek!");
      address = this.wallet.peekAddress(KeychainKind.External, index);
    } else if (nextIndex < index) {
      console.log("reveal addresses to");
      //  while (nextIndex < index){
      const addressesRevealed = this.wallet.revealAddressesTo(
        KeychainKind.External,
        index,
      );
      address = addressesRevealed[addressesRevealed.length - 1];
      //  }
    }

    if (!address) throw Error("no address");

    const addressString = address.address
      .toQrUri()
      .replace("bitcoin:", "")
      .toLowerCase();
    return {
      index,
      used: index < lastUnusedIndex,
      address: addressString,
    };
  }

  async getLastUnusedAddress() {
    console.log("async getLastUnusedAddress()");
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    if (!this.lastUnusedAddress) {
      const unusedAddresses = this.wallet?.listUnusedAddresses(
        KeychainKind.External,
      );

      let lastUnusedAddress =
        unusedAddresses.length === 0
          ? this.wallet.revealNextAddress(KeychainKind.External)
          : unusedAddresses[unusedAddresses.length - 1];

      const nextDerivationIndex = this.wallet.nextDerivationIndex(
        KeychainKind.External,
      );
      console.log("last", lastUnusedAddress.index);
      console.log("next", nextDerivationIndex);
      if (nextDerivationIndex !== lastUnusedAddress.index + 1) {
        console.log("444");
        lastUnusedAddress = this.wallet.revealNextAddress(
          KeychainKind.External,
        );
      }

      const addressString = lastUnusedAddress.address
        .toQrUri()
        .replace("bitcoin:", "")
        .toLowerCase();

      this.lastUnusedAddress = {
        ...lastUnusedAddress,
        address: addressString,
      };
    }
    return this.lastUnusedAddress;
  }

  async getInternalAddress(index: number = 0) {
    console.log("async getInternalAddress()");
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    let addressInfo: AddressInfo;
    if (index === 0) {
      addressInfo = this.wallet.revealNextAddress(KeychainKind.External);
    } else {
      addressInfo = this.wallet.peekAddress(KeychainKind.External, index);
    }
    const addressString = addressInfo.address
      .toQrUri()
      .replace("bitcoin:", "")
      .toLowerCase();
    return {
      ...addressInfo,
      address: addressString,
    };
  }

  async getAddressUTXO(address: string) {
    console.log("async getAddressUTXO()");
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    const utxo = this.wallet.listUnspent();
    const utxoAddresses = utxo.map(
      getUTXOAddress(convertBitcoinNetworkToBDKNetwork(NETWORK)),
    );

    return utxo.filter((utx, i) => utxoAddresses[i] === address);
  }

  async buildFinishedTransaction(buildParams: BuildTxParams) {
    console.log("async buildFinishedTransaction()");
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - buildFinishedTransaction - start");

    const transaction = await buildTransaction(buildParams);

    console.log("11...");
    const result = await this.finishTransaction(transaction);

    return result;
  }

  async finishTransaction<T extends TxBuilderInterface | BumpFeeTxBuilder>(
    transaction: T,
  ): Promise<ReturnType<T["finish"]>>;

  async finishTransaction(transaction: TxBuilderInterface | BumpFeeTxBuilder) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - finishTransaction - start");
    try {
      const result = transaction.finish(this.wallet);
      console.log("12...");
      return result;
    } catch (e) {
      console.log("xxxxxx...");
      throw handleTransactionError(parseError(e));
    }
  }

  async signAndBroadcastPSBT(psbt: PsbtInterface) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - signAndBroadcastPSBT - start");
    try {
      console.log("psbt", psbt);
      const wasFinalized = this.wallet.sign(psbt, undefined);
      if (!wasFinalized) throw Error("Signed Transaction was not finalized");

      info("PeachWallet - signAndBroadcastPSBT - signed");
      if (this.esploraClient) {
        console.log("Esplora broadcast");
        console.log("in1...");
        this.esploraClient.broadcast(psbt.extractTx());
        console.log("out1...");
      } else if (this.electrumClient) {
        console.log("Electrum broadcast");
        console.log("in2...");
        this.electrumClient.transactionBroadcast(psbt.extractTx());
        console.log("out2...");
      }

      info("PeachWallet - signAndBroadcastPSBT - broadcasted");

      await this.syncWallet().catch((e) => {
        error(parseError(e));
      });

      info("PeachWallet - signAndBroadcastPSBT - end");

      return psbt;
    } catch (e) {
      console.log("ERRRRRORRRR", e);
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

const querySQLiteFile = async (dbPath: string): Promise<number | null> => {
  const dbName = dbPath.split("/").pop(); // extract filename
  if (!dbName) {
    console.warn("Invalid DB path:", dbPath);
    return null;
  }

  try {
    // Open DB in promise mode
    const db = await SQLite.openDatabase({
      name: dbName,
      location: "default",
    });

    console.log("Database opened:", dbName);

    // Run query using await
    const [result] = await db.executeSql(
      `SELECT value 
       FROM last_derivation_indices 
       WHERE keychain = ?`,
      ['"External"'], // keep quotes to match DB
    );

    if (result.rows.length > 0) {
      const value = result.rows.item(0).value;
      console.log("Query result:", value);
      return value;
    } else {
      console.log("No rows found");
      return null;
    }
  } catch (error) {
    console.error("SQLite query failed:", error);
    return null;
  }
};

async function getDBConfig(
  network: Network,
  nodeType: BlockChainNames = BlockChainNames.Electrum,
): Promise<{ persister: PersisterInterface; latestDerivationIndex?: number }> {
  if (
    Platform.OS === "ios" &&
    parseInt(Platform.Version, 10) < MIN_VERSION_FOR_SQLITE
  ) {
    return {
      persister: Persister.newInMemory(),
      latestDerivationIndex: undefined,
    };
  }
  const dbName = `peach-${network}${nodeType}`;
  const sqliteFilePath = `${DocumentDirectoryPath}/${dbName}_v2_x_x.sqlite3`;
  const directoryPath = `${DocumentDirectoryPath}/`;

  let latestDerivationIndex: number | undefined = undefined;
  const destDirectory = `${LibraryDirectoryPath}/LocalDatabase`;
  try {
    const files = await readDir(directoryPath);
    console.log("Files in directory:", files);
    for (const file of files) {
      if (file.path !== sqliteFilePath) {
        console.log("OLD FILE! ", file.name);
        console.log("is file", file.isFile());
        console.log("is directory", file.isDirectory());
        console.log("file path", file.path);

        try {
          if (!(await exists(destDirectory))) {
            await mkdir(destDirectory);
          }
          await copyFile(file.path, `${destDirectory}/${file.name}`);
        } catch (mkdirErr) {
          console.log("mkdirErr", mkdirErr);
        }

        const foundExternalIndex = await querySQLiteFile(file.path);
        if (foundExternalIndex && foundExternalIndex > 25) {
          latestDerivationIndex = foundExternalIndex;
        }
      }
    }
  } catch (err) {
    console.log("Error reading directory:", err);
  }
  return {
    persister: Persister.newSqlite(sqliteFilePath),
    latestDerivationIndex,
  };
}
