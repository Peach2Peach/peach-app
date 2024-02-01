import { LocalUtxo, OutPoint, TxOut } from "bdk-rn/lib/classes/Bindings";
import { Script } from "bdk-rn/lib/classes/Script";
import { KeychainKind } from "bdk-rn/lib/lib/enums";
import { renderHook, waitFor } from "test-utils";
import { confirmed1 } from "../../../../tests/unit/data/transactionDetailData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { createTestWallet } from "../../../../tests/unit/helpers/createTestWallet";
import { PeachWallet } from "../../../utils/wallet/PeachWallet";
import { getUTXOId } from "../../../utils/wallet/getUTXOId";
import { peachWallet, setPeachWallet } from "../../../utils/wallet/setWallet";
import { useWalletState } from "../../../utils/wallet/walletStore";
import { useUTXOs } from "./useUTXOs";

jest.useFakeTimers();

describe("useUTXOs", () => {
  const outpoint = new OutPoint(confirmed1.txid, 0);
  const amount = 10000;
  const txOut = new TxOut(amount, new Script("address"));
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External);
  const listUnspentMock = jest.fn().mockResolvedValue([utxo]);

  beforeAll(() => {
    setPeachWallet(new PeachWallet({ wallet: createTestWallet() }));
    if (peachWallet.wallet) {
      peachWallet.wallet.listUnspent = listUnspentMock;
    }
  });

  it("should unspent transaction outputs", async () => {
    const { result } = renderHook(useUTXOs);

    await waitFor(() => {
      expect(result.current.data).toEqual([utxo]);
    });
  });

  it("should return selected utxos", async () => {
    useWalletState.setState({ selectedUTXOIds: [getUTXOId(utxo)] });
    const { result } = renderHook(useUTXOs);

    await waitFor(() => {
      expect(result.current.selectedUTXOs).toEqual([utxo]);
    });
  });

  it("should not get utxos if wallet is not initialized", async () => {
    peachWallet.wallet = undefined;
    renderHook(useUTXOs);

    await waitFor(() => {
      expect(listUnspentMock).not.toHaveBeenCalled();
    });
  });

  it("should update the query cache", async () => {
    const { result } = renderHook(useUTXOs);

    await waitFor(() => {
      expect(result.current.data).toEqual([utxo]);
    });

    expect(queryClient.getQueryData(["utxos"])).toEqual([utxo]);
  });
});
