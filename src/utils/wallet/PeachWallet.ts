import { DocumentDirectoryPath } from "@dr.pogodin/react-native-fs";
import { NETWORK } from "@env";
import {
  AddressIndex,
  AddressInfo,
  BumpFeeTxBuilder,
  ElectrumClient,
  EsploraClient,
  Network,
  Persister,
  Psbt,
  TxBuilder,
  TxDetails,
  Wallet
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

  wallet: Wallet | undefined;

  lastUnusedAddress?: Omit<AddressInfo, "address"> & {
    address: string;
  };

  blockchain: EsploraClient | ElectrumClient | undefined;
  esploraClient: EsploraClient | undefined;
  electrumClient: ElectrumClient | undefined;

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

          const dbConfig = await getDBConfig(
            convertBitcoinNetworkToBDKNetwork(NETWORK),
            this.nodeType,
          );

          info("PeachWallet - initWallet - createWallet");

          this.wallet = new Wallet(
            externalDescriptor,
            internalDescriptor,
            convertBitcoinNetworkToBDKNetwork(NETWORK),
            dbConfig,
          );

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


    if (nodeConfig.type === undefined) { throw Error("No blockchain type") }
    if (nodeConfig.url === undefined) { throw Error("No blockchain url") }


    if (
      nodeConfig.type === BlockChainNames.Esplora) {
      const newEsploraClient = new EsploraClient(addProtocol(nodeConfig.url, nodeConfig.ssl ? "https" : "http"))
      this.blockchain = newEsploraClient
      this.esploraClient = newEsploraClient
      this.nodeType = BlockChainNames.Esplora
    }
    else if (nodeConfig.type === BlockChainNames.Electrum) {

      const newElectrumClient = new ElectrumClient(addProtocol(nodeConfig.url, nodeConfig.ssl ? "ssl" : "tcp"))
      this.blockchain = newElectrumClient
      this.electrumClient = newElectrumClient
      this.nodeType = BlockChainNames.Electrum
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
          const success = await this.wallet.sync(this.blockchain);
          if (success) {
            const balance = await this.wallet.getBalance();
            this.balance = Number(balance.total);
            useWalletState.getState().setBalance(this.balance);

            this.transactions = await this.wallet.listTransactions(true);
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
          }

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

  async getAddress(index: AddressIndex | number = AddressIndex.New) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    info("Getting address at index ", index);
    const addressInfo = await this.wallet.getAddress(index);
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    };
  }

  async getAddressByIndex(index: number) {
    const { index: lastUnusedIndex } = await this.getLastUnusedAddress();
    const address = await this.getAddress(index);
    return {
      index,
      used: index < lastUnusedIndex,
      address: address.address,
    };
  }

  async getLastUnusedAddress() {
    if (!this.lastUnusedAddress) {
      this.lastUnusedAddress = await this.getAddress(AddressIndex.LastUnused);
    }
    return this.lastUnusedAddress;
  }

  async getInternalAddress(index: AddressIndex | number = AddressIndex.New) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");
    const addressInfo = await this.wallet.getInternalAddress(index);
    return {
      ...addressInfo,
      address: await addressInfo.address.asString(),
    };
  }

  async getAddressUTXO(address: string) {
    if (!this.wallet) throw Error("WALLET_NOT_READY");

    const utxo = this.wallet.listUnspent();
    const utxoAddresses = await Promise.all(
      utxo.map(getUTXOAddress(convertBitcoinNetworkToBDKNetwork(NETWORK))),
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
        this.esploraClient.broadcast(psbt.extractTx())
      }
      else if (this.electrumClient) {
        this.electrumClient.transactionBroadcast(psbt.extractTx())
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
    return Persister.newInMemory()
  }
  const dbName = `peach-${network}${nodeType}`;
  const directory = `${DocumentDirectoryPath}/${dbName}`;
  return Persister.newSqlite(directory)
}
