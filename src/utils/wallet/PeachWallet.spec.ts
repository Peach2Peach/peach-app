import { BLOCKEXPLORER } from "@env";
import {
  Address,
  PartiallySignedTransaction,
  Transaction,
  TxBuilder,
} from "bdk-rn";
import {
  LocalUtxo,
  OutPoint,
  TxBuilderResult,
  TxOut,
} from "bdk-rn/lib/classes/Bindings";
import { Script } from "bdk-rn/lib/classes/Script";
import {
  AddressIndex,
  BlockChainNames,
  KeychainKind,
  Network,
} from "bdk-rn/lib/lib/enums";
import { waitFor } from "test-utils";
import { account1 } from "../../../tests/unit/data/accountData";
import { insufficientFunds } from "../../../tests/unit/data/errors";
import {
  confirmed1,
  pending1,
  pending2,
} from "../../../tests/unit/data/transactionDetailData";
import { getError } from "../../../tests/unit/helpers/getError";
import {
  blockChainCreateMock,
  blockchainBroadcastMock,
  mnemonicFromStringMock,
  psbtExtractTxMock,
  txBuilderFinishMock,
  walletGetAddressMock,
  walletGetBalanceMock,
  walletGetInternalAddressMock,
  walletListTransactionsMock,
  walletSignMock,
  walletSyncMock,
} from "../../../tests/unit/mocks/bdkRN";
import { error as logError } from "../log/error";
import { PeachWallet } from "./PeachWallet";
import { createWalletFromBase58 } from "./createWalletFromBase58";
import { getNetwork } from "./getNetwork";
import { useWalletState } from "./walletStore";

jest.mock("./PeachWallet", () => jest.requireActual("./PeachWallet"));

jest.mock("./transaction/buildTransaction");
const buildTransactionMock = jest.requireMock(
  "./transaction/buildTransaction",
).buildTransaction;

jest.useFakeTimers();

describe("PeachWallet", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  let peachWallet: PeachWallet;

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet });
    await peachWallet.initWallet();
  });
  afterEach(() => {
    useWalletState.getState().reset();
  });

  it("instantiates", () => {
    peachWallet = new PeachWallet({ wallet });

    expect(peachWallet.initialized).toBeFalsy();
  });
  it("synchronises wallet with the blockchain", async () => {
    walletSyncMock.mockResolvedValueOnce(true);

    peachWallet.lastUnusedAddress = {
      index: 0,
      address: "addres",
      keychain: KeychainKind.External,
    };
    await peachWallet.syncWallet();
    expect(walletSyncMock).toHaveBeenCalled();
    expect(peachWallet.lastUnusedAddress).toBeUndefined();
  });
  it("catches wallet sync errors", async () => {
    walletSyncMock.mockImplementationOnce(() => {
      throw new Error("error");
    });

    const error = await getError<Error>(() => peachWallet.syncWallet());
    expect(error.message).toBe("error");
  });
  it("waits for already running sync", async () => {
    jest.clearAllMocks();
    const delay = 100;
    const promise = new Promise((resolve) => setTimeout(resolve, delay));
    walletSyncMock.mockReturnValueOnce(promise);

    expect(peachWallet.syncInProgress).toBeUndefined();
    peachWallet.syncWallet();
    expect(peachWallet.syncInProgress).not.toBeUndefined();
    peachWallet.syncWallet();
    jest.runAllTimers();
    await peachWallet.syncInProgress;
    expect(peachWallet.syncInProgress).toBeUndefined();
    expect(walletSyncMock).toHaveBeenCalledTimes(1);
  });
  it("gets balance and transactions after sync", async () => {
    walletSyncMock.mockResolvedValueOnce(true);
    const totalBalance = 111110;
    walletGetBalanceMock.mockResolvedValueOnce({
      total: totalBalance,
    });
    const transactions = [confirmed1, pending2];
    walletListTransactionsMock.mockResolvedValueOnce(transactions);
    await peachWallet.syncWallet();
    await waitFor(() => expect(peachWallet.balance).toBe(totalBalance));
    await waitFor(() => expect(peachWallet.transactions).toEqual(transactions));
  });
  it("sync wallet attempt throws error if wallet is not ready", async () => {
    peachWallet.wallet = undefined;
    const error = await getError<Error>(() => peachWallet.syncWallet());

    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("gets the last unused receiving address", async () => {
    const address = "address";
    const addressObject = new Address();
    addressObject.asString = jest.fn().mockResolvedValueOnce(address);
    const index = 4;
    walletGetAddressMock.mockResolvedValueOnce({
      address: addressObject,
      index,
    });

    const { address: newAddress, index: addressIndex } =
      await peachWallet.getLastUnusedAddress();
    expect(newAddress).toBe(address);
    expect(addressIndex).toBe(index);
    expect(walletGetAddressMock).toHaveBeenCalledWith(AddressIndex.LastUnused);
  });
  it("gets the last unused receiving address once and caches the result", async () => {
    const address = "address";
    const addressObject = new Address();
    addressObject.asString = jest.fn().mockResolvedValueOnce(address);
    const index = 4;
    walletGetAddressMock.mockResolvedValueOnce({
      address: addressObject,
      index,
    });

    await peachWallet.getLastUnusedAddress();
    const { address: newAddress, index: addressIndex } =
      await peachWallet.getLastUnusedAddress();
    expect(newAddress).toBe(address);
    expect(addressIndex).toBe(index);
    expect(walletGetAddressMock).toHaveBeenCalledTimes(1);
  });
  it("gets new internal address", async () => {
    const address = "address";
    const addressObject = new Address();
    addressObject.asString = jest.fn().mockResolvedValueOnce(address);
    const index = 4;
    walletGetInternalAddressMock.mockResolvedValueOnce({
      address: addressObject,
      index,
    });

    const { address: newAddress, index: addressIndex } =
      await peachWallet.getInternalAddress();
    expect(newAddress).toBe(address);
    expect(addressIndex).toBe(index);
    expect(walletGetInternalAddressMock).toHaveBeenCalledWith(AddressIndex.New);
  });
  it("gets address by index", async () => {
    const address = "address";
    const addressObject = new Address();
    addressObject.asString = jest.fn().mockResolvedValue(address);
    const index = 4;
    walletGetAddressMock.mockResolvedValue({ address: addressObject, index });

    const addressInfo = await peachWallet.getAddressByIndex(index);
    expect(addressInfo).toEqual({ index, address, used: false });
  });
  it("gets a new unused receiving address", async () => {
    const address = "address";
    const addressObject = new Address();
    addressObject.asString = jest.fn().mockResolvedValueOnce(address);
    const index = 4;
    walletGetAddressMock.mockResolvedValueOnce({
      address: addressObject,
      index,
    });

    const { address: newAddress, index: addressIndex } =
      await peachWallet.getAddress();
    expect(newAddress).toBe(address);
    expect(addressIndex).toBe(index);
    expect(walletGetAddressMock).toHaveBeenCalledWith(AddressIndex.New);
  });
  it("throws error when requesting receiving address before wallet is ready", async () => {
    peachWallet.wallet = undefined;
    const error = await getError<Error>(() => peachWallet.getAddress());
    expect(error.message).toBe("WALLET_NOT_READY");
  });

  it("signs and broadcast a transaction", async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction("base64"),
      txDetails: pending1,
    };
    const transaction = await new Transaction().create([]);

    walletSignMock.mockResolvedValueOnce(result.psbt);
    psbtExtractTxMock.mockResolvedValueOnce(transaction);
    const signAndSendResult = await peachWallet.signAndBroadcastPSBT(
      result.psbt,
    );
    expect(walletSignMock).toHaveBeenCalledWith(result.psbt);
    expect(blockchainBroadcastMock).toHaveBeenCalledWith(transaction);
    expect(signAndSendResult).toEqual(result.psbt);
  });
  it("finishes a transaction", async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction("base64"),
      txDetails: pending1,
    };
    txBuilderFinishMock.mockResolvedValueOnce(result);
    const txBuilder = await new TxBuilder().create();

    const signAndSendResult = await peachWallet.finishTransaction(txBuilder);
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet);
    expect(signAndSendResult).toEqual(result);
  });
  it("throws error when trying to broadcast before wallet is ready", async () => {
    peachWallet.wallet = undefined;
    const error = await getError<Error>(() =>
      peachWallet.signAndBroadcastPSBT(
        new PartiallySignedTransaction("base64"),
      ),
    );
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("handles broadcast errors", async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction("base64"),
      txDetails: pending1,
    };
    const transaction = await new Transaction().create([]);

    walletSignMock.mockResolvedValueOnce(result.psbt);
    psbtExtractTxMock.mockResolvedValueOnce(transaction);
    blockchainBroadcastMock.mockImplementationOnce(() => {
      throw insufficientFunds;
    });
    const error = await getError<Error>(() =>
      peachWallet.signAndBroadcastPSBT(result.psbt),
    );
    expect(error).toEqual([
      new Error("INSUFFICIENT_FUNDS"),
      { available: "1089000", needed: "78999997952" },
    ]);
  });
  it("silently catches sync errors after broadcast", async () => {
    const result: TxBuilderResult = {
      psbt: new PartiallySignedTransaction("base64"),
      txDetails: pending1,
    };
    const transaction = await new Transaction().create([]);

    walletSignMock.mockResolvedValueOnce(result.psbt);
    psbtExtractTxMock.mockResolvedValueOnce(transaction);
    walletSyncMock.mockImplementationOnce(() => {
      throw new Error("sync error");
    });
    const signAndSendResult = await peachWallet.signAndBroadcastPSBT(
      result.psbt,
    );
    expect(signAndSendResult).toEqual(result.psbt);
    await waitFor(() => expect(logError).toHaveBeenCalledWith("sync error"));
  });
  it("throws error when trying to finish transaction before wallet is ready", async () => {
    peachWallet.wallet = undefined;
    const error = await getError<Error>(() =>
      peachWallet.finishTransaction(new TxBuilder()),
    );
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("handles finish transaction errors", async () => {
    txBuilderFinishMock.mockImplementationOnce(() => {
      throw insufficientFunds;
    });
    const error = await getError<Error>(() =>
      peachWallet.finishTransaction(new TxBuilder()),
    );
    expect(error).toEqual([
      new Error("INSUFFICIENT_FUNDS"),
      { available: "1089000", needed: "78999997952" },
    ]);
  });
});

describe("PeachWallet - loadWallet", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  let peachWallet: PeachWallet;

  beforeEach(() => {
    peachWallet = new PeachWallet({ wallet });
    useWalletState.getState().reset();
  });
  it("loads existing data", async () => {
    const balance = 50000;
    useWalletState.getState().setBalance(balance);
    await peachWallet.initWallet();
    expect(peachWallet.balance).toBe(balance);
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      {
        sock5: null,
        retry: 1,
        timeout: 5,
        validateDomain: false,
        stopGap: 25,
        url: BLOCKEXPLORER,
      },
      BlockChainNames.Electrum,
    );
  });
  it("loads wallet with seed", async () => {
    await peachWallet.initWallet(account1.mnemonic);
    expect(mnemonicFromStringMock).toHaveBeenCalledWith(account1.mnemonic);
  });
  it("load existing when wallet store is ready", async () => {
    const balance = 50000;
    const hasHydratedSpy = jest.spyOn(useWalletState.persist, "hasHydrated");
    const onFinishHydrationSpy = jest.spyOn(
      useWalletState.persist,
      "onFinishHydration",
    );
    hasHydratedSpy.mockReturnValueOnce(false);
    onFinishHydrationSpy.mockImplementationOnce((cb) =>
      // @ts-expect-error it's just a mock
      cb(useWalletState.getState()),
    );
    useWalletState.getState().setBalance(balance);
    await peachWallet.loadWallet();
    expect(peachWallet.balance).toBe(balance);
  });
  it("sets initialized to true when wallet is loaded", async () => {
    await peachWallet.initWallet();
    expect(peachWallet.initialized).toBeTruthy();
  });
});

describe("PeachWallet - buildFinishedTransaction", () => {
  const wallet = createWalletFromBase58(account1.base58, getNetwork());
  let peachWallet: PeachWallet;

  beforeEach(async () => {
    peachWallet = new PeachWallet({ wallet });
    await peachWallet.initWallet();
  });
  const value = 10000;
  const utxo = new LocalUtxo(
    new OutPoint("txid", 0),
    new TxOut(value, new Script("address")),
    false,
    KeychainKind.External,
  );
  const params = {
    address: "address",
    amount: 10000,
    feeRate: 10,
    utxos: [utxo],
    shouldDrainWallet: true,
  };
  it("should call buildTransaction with the correct params and finish the tx", async () => {
    const txBuilder = await new TxBuilder().create();
    buildTransactionMock.mockResolvedValueOnce(txBuilder);

    await peachWallet.buildFinishedTransaction(params);
    expect(buildTransactionMock).toHaveBeenCalledWith(params);
    expect(txBuilderFinishMock).toHaveBeenCalledWith(peachWallet.wallet);
  });
  it("should handle the wallet not being ready", async () => {
    peachWallet.wallet = undefined;
    const error = await getError<Error>(() =>
      peachWallet.buildFinishedTransaction(params),
    );
    expect(error.message).toBe("WALLET_NOT_READY");
  });
  it("sets correct blockchain by config", async () => {
    const url = "blockstream.info";
    await peachWallet.setBlockchain({
      enabled: true,
      url,
      ssl: true,
      type: BlockChainNames.Electrum,
    });
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      {
        url: `ssl://${url}`,
        sock5: null,
        retry: 1,
        timeout: 5,
        stopGap: 25,
        validateDomain: false,
      },
      BlockChainNames.Electrum,
    );
    await peachWallet.setBlockchain({
      enabled: true,
      url,
      ssl: true,
      type: BlockChainNames.Esplora,
    });
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      {
        baseUrl: `https://${url}`,
        proxy: null,
        concurrency: 1,
        timeout: 30,
        stopGap: 25,
      },
      BlockChainNames.Esplora,
    );
    await peachWallet.setBlockchain({
      enabled: false,
      url,
      ssl: true,
      type: BlockChainNames.Electrum,
    });

    expect(blockChainCreateMock).toHaveBeenCalledWith(
      {
        sock5: null,
        retry: 1,
        timeout: 5,
        validateDomain: false,
        stopGap: 25,
        url: BLOCKEXPLORER,
      },
      BlockChainNames.Electrum,
    );
    await peachWallet.setBlockchain({
      enabled: true,
      url,
      ssl: true,
      type: BlockChainNames.Rpc,
    });
    expect(blockChainCreateMock).toHaveBeenCalledWith(
      { url, walletName: "peach", network: Network.Bitcoin },
      BlockChainNames.Rpc,
    );
  });
});
