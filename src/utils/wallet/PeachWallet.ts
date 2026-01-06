import { DocumentDirectoryPath } from "@dr.pogodin/react-native-fs";
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
  PsbtInterface,
  TxBuilder,
  TxDetails,
  UpdateInterface,
  Wallet,
  WalletInterface
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
          
          try {
            this.wallet = Wallet.load(
              externalDescriptor,
              internalDescriptor,
              dbConfig,
            );
          } catch (e) {
            if ( LoadWithPersistError.instanceOf(e)){
                this.wallet = new Wallet(
            externalDescriptor,
            internalDescriptor,
            convertBitcoinNetworkToBDKNetwork(NETWORK),
            dbConfig,
          );
            }
            else{
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
    nodeConfig.url = "http://localhost:30000";

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

      const hhh = newEsploraClient.getHeight()
      console.log("CUR HEIGHT: ", hhh)

      this.blockchain = newEsploraClient;
      this.esploraClient = newEsploraClient;
      this.nodeType = BlockChainNames.Esplora;
    } else if (nodeConfig.type === BlockChainNames.Electrum) {
      const newElectrumClient = new ElectrumClient(
        addProtocol(nodeConfig.url, nodeConfig.ssl ? "ssl" : "tcp"),
      );
      newElectrumClient.ping()
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

          console.log("....")

          if (this.hasEverBeenFullySynced) {
            const syncBuilder = this.wallet.startSyncWithRevealedSpks();
            const syncRequest = syncBuilder.build();
            console.log("1111....")
            walletUpdate = this.blockchain.sync(
              syncRequest,
              BigInt(100),
              false,
            );
          } else {
            const fullScanBuilder = this.wallet.startFullScan();
            const fullScanRequest = fullScanBuilder.build();
            console.log("2222....")
            
            walletUpdate = this.blockchain.fullScan(
              fullScanRequest,
              BigInt(100),
              BigInt(10),
              true,
            );
            
            console.log("3333....")
          }
          console.log("here....")
          this.wallet.applyUpdate(walletUpdate);
          console.log("othger side!!!....")
          this.hasEverBeenFullySynced = true;

          const balance = this.wallet.balance();
          console.log("MAZZZ 1....")
          const balanceNumber = Number(balance.total.toSat());
          this.balance = balanceNumber
          console.log("MAZZZ 2....",balanceNumber)
          useWalletState.getState().setBalance(balanceNumber);

          console.log("MAZZZ 3....")

          const walletTransactions = this.wallet.transactions().map((x) => {
            const details = this.wallet?.txDetails(x.transaction.computeTxid());
            console.log("coool")
            if (details === undefined) {
              throw new Error("txDetails returned undefined");
            }
            return details;
          });

          console.log("MAZZZ 4....")

          this.transactions = walletTransactions;
          console.log("MAZZZ 5....")

          // useWalletState.getState().setTransactions(this.transactions);
          console.log("MAZZZ 6....")
          const offers = await queryClient.fetchQuery({
            queryKey: offerKeys.summaries(),
            queryFn: getOfferSummariesQuery,
          });
          console.log("MAZZZ 7....")
          const contracts = await queryClient.fetchQuery({
            queryKey: contractKeys.summaries(),
            queryFn: getContractSummariesQuery,
          });
          console.log("MAZZZ 8....")
          this.transactions
            .filter((tx) => !transactionHasBeenMappedToOffers(tx))
            .forEach(mapTransactionToOffer({ offers, contracts }));
          console.log("MAZZZ 9....")
          this.transactions
            .filter(transactionHasBeenMappedToOffers)
            .forEach(labelAddressByTransaction);
          
          console.log("MAZZZ 10....")
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
      addressInfo = this.wallet.revealNextAddress(KeychainKind.External);
    } else {
      const addressesRevealed = this.wallet.revealAddressesTo(KeychainKind.External, index);
      addressInfo = addressesRevealed[addressesRevealed.length - 1]
    }

    const addressString = addressInfo.address.toQrUri().replace("bitcoin:","").toLowerCase()

    return {
      ...addressInfo,
      address: addressString,
    };
  }

  async getAddressByIndex(index: number) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress();
    const address = this.wallet?.peekAddress(KeychainKind.External, index);

    const addressString = address.address.toQrUri().replace("bitcoin:","").toLowerCase()
    return {
      index,
      used: index < lastUnusedIndex,
      address: addressString,
    };
  }

  async getLastUnusedAddress() {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    if (!this.lastUnusedAddress) {
      const unusedAddresses = this.wallet?.listUnusedAddresses(
        KeychainKind.External,
      );

      const lastUnusedAddress =
        unusedAddresses.length === 0
          ? this.wallet.revealNextAddress(KeychainKind.External)
          : unusedAddresses[unusedAddresses.length - 1];

      const addressString = lastUnusedAddress.address.toQrUri().replace("bitcoin:","").toLowerCase()
      this.lastUnusedAddress = {
        ...lastUnusedAddress,
        address: addressString,
      };
    }
    return this.lastUnusedAddress;
  }

  async getInternalAddress(index: number = 0) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    let addressInfo: AddressInfo;
    if (index === 0) {
      addressInfo = this.wallet.revealNextAddress(KeychainKind.External);
    } else {
      addressInfo = this.wallet.peekAddress(KeychainKind.External, index);
    }
    const addressString = addressInfo.address.toQrUri().replace("bitcoin:","").toLowerCase()
    return {
      ...addressInfo,
      address: addressString,
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
    
    console.log("11...")
    const result =  await this.finishTransaction(transaction);

    return result
  }

  async finishTransaction<T extends TxBuilder | BumpFeeTxBuilder>(
    transaction: T,
  ): Promise<ReturnType<T["finish"]>>;

  async finishTransaction(transaction: TxBuilder | BumpFeeTxBuilder) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - finishTransaction - start");
    try {
      
      const result =  transaction.finish(this.wallet);
      console.log("12...")
      return result
    } catch (e) {
      console.log("xxxxxx...")
      throw handleTransactionError(parseError(e));
    }
  }

  async signAndBroadcastPSBT(psbt: PsbtInterface) {
    if (!this.wallet || !this.blockchain) throw Error("WALLET_NOT_READY");
    info("PeachWallet - signAndBroadcastPSBT - start");
    try {
      console.log("psbt",psbt)
      const wasFinalized = this.wallet.sign(psbt,undefined); 
      if (!wasFinalized) throw Error("Signed Transaction was not finalized");

      info("PeachWallet - signAndBroadcastPSBT - signed");
      if (this.esploraClient) {
        console.log("Esplora broadcast")
        console.log("in1...")
        this.esploraClient.broadcast(psbt.extractTx());
        console.log("out1...")
      } else if (this.electrumClient) {
        console.log("Electrum broadcast")
        console.log("in2...")
        this.electrumClient.transactionBroadcast(psbt.extractTx());
        console.log("out2...")
      }

      info("PeachWallet - signAndBroadcastPSBT - broadcasted");

      this.syncWallet().catch((e) => {
        error(parseError(e));
      });

      info("PeachWallet - signAndBroadcastPSBT - end");

      return psbt;
    } catch (e) {
      console.log("ERRRRRORRRR", e)
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
  const directory = `${DocumentDirectoryPath}/${dbName}_v2_x_x.sqlite3`;
  return Persister.newSqlite(directory);
}
