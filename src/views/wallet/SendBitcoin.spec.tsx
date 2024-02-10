import { Wallet } from "bdk-rn";
import { LocalUtxo, OutPoint, TxOut } from "bdk-rn/lib/classes/Bindings";
import { Script } from "bdk-rn/lib/classes/Script";
import { KeychainKind } from "bdk-rn/lib/lib/enums";
import { Provider } from "jotai";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { act, fireEvent, render, waitFor } from "test-utils";
import { account1 } from "../../../tests/unit/data/accountData";
import { confirmed1 } from "../../../tests/unit/data/transactionDetailData";
import { navigateMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { swipeRight } from "../../../tests/unit/helpers/fireSwipeEvent";
import { walletListUnspentMock } from "../../../tests/unit/mocks/bdkRN";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { PeachWallet } from "../../utils/wallet/PeachWallet";
import { createWalletFromBase58 } from "../../utils/wallet/createWalletFromBase58";
import { getNetwork } from "../../utils/wallet/getNetwork";
import { getUTXOId } from "../../utils/wallet/getUTXOId";
import { peachWallet, setPeachWallet } from "../../utils/wallet/setWallet";
import {
  defaultWalletState,
  useWalletState,
} from "../../utils/wallet/walletStore";
import { SendBitcoin } from "./SendBitcoin";
import { walletKeys } from "./hooks/useUTXOs";
expect.extend({ toMatchDiffSnapshot });

jest.useFakeTimers();

describe("SendBitcoin", () => {
  beforeAll(() => {
    const wallet = createWalletFromBase58(account1.base58, getNetwork());
    setPeachWallet(new PeachWallet({ wallet }));
  });

  beforeEach(() => {
    useWalletState.setState(defaultWalletState);
  });

  it("should render correctly", () => {
    const { toJSON } = render(<SendBitcoin />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should update the address on change", () => {
    const { toJSON, getByPlaceholderText } = render(<SendBitcoin />);
    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(addressInput, "test");
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should update the amount on change", () => {
    peachWallet.balance = 21000000;
    const { toJSON, getByText } = render(<SendBitcoin />);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it('should set the amount to the peach wallet balance when clicking "send max"', () => {
    peachWallet.balance = 21000000;
    const { toJSON, getByText } = render(<SendBitcoin />);
    const sendMaxButton = getByText("send max");
    fireEvent.press(sendMaxButton);
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should not allow entering an amount higher than the available balance", () => {
    peachWallet.balance = 21000000;
    const { toJSON, getByText } = render(<SendBitcoin />);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "123456789");
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should update the fee rate on change", () => {
    const { toJSON, getByText } = render(<SendBitcoin />);
    const mediumFeeButton = getByText("~ 30 minutes  (6 sat/vB)");
    fireEvent.press(mediumFeeButton);
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should should the help popup when clicking on the questionmark in the header", () => {
    const { getByAccessibilityHint, queryByText } = render(
      <>
        <SendBitcoin />
        <GlobalPopup />
      </>,
    );

    const helpButton = getByAccessibilityHint("help");
    fireEvent.press(helpButton);

    expect(queryByText("help")).toBeTruthy();
  });
  it("should disable the slider while the wallet is not synced", () => {
    useWalletState.setState({ isSynced: false });
    const { getByText, getByPlaceholderText, toJSON } = render(<SendBitcoin />);

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(
      addressInput,
      "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0",
    );
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const mediumFeeButton = getByText("~ 30 minutes  (6 sat/vB)");
    fireEvent.press(mediumFeeButton);

    const withSyncingWallet = toJSON();
    act(() => {
      useWalletState.setState({ isSynced: true });
    });
    const withSyncedWallet = toJSON();

    expect(withSyncedWallet).toMatchDiffSnapshot(withSyncingWallet);
  });

  it("should open the confirmation popup when swiping the slider", async () => {
    useWalletState.setState({ isSynced: true });
    const { getByTestId, getByText, getByPlaceholderText, queryByText } =
      render(
        <>
          <SendBitcoin />
          <GlobalPopup />
        </>,
      );

    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(
      addressInput,
      "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0",
    );
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const mediumFeeButton = getByText("~ 30 minutes  (6 sat/vB)");
    fireEvent.press(mediumFeeButton);

    const slider = getByTestId("confirmSlider");
    const feeAmount = 1000;
    peachWallet.buildFinishedTransaction = jest
      .fn()
      .mockResolvedValue({ psbt: { feeAmount: () => feeAmount } });
    swipeRight(slider);

    await waitFor(() => {
      expect(queryByText("sending funds")).toBeTruthy();
    });
  });
  it("should disable the slider while the form is invalid", () => {
    const { getByTestId, queryByText } = render(
      <Provider>
        <SendBitcoin />
        <GlobalPopup />
      </Provider>,
    );
    const slider = getByTestId("confirmSlider");
    swipeRight(slider);
    expect(queryByText("sending funds")).toBeFalsy();
  });
  it('should set the fee rate to undefined when selecting "custom"', () => {
    const { getByText, getByPlaceholderText, getByTestId, queryByText } =
      render(
        <Provider>
          <SendBitcoin />
          <GlobalPopup />
        </Provider>,
      );
    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(
      addressInput,
      "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0",
    );
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const customFeeButton = getByText("custom: ");
    fireEvent.press(customFeeButton);

    swipeRight(getByTestId("confirmSlider"));
    expect(queryByText("sending funds")).toBeFalsy();
  });
  it("should update the custom fee rate on change", async () => {
    useWalletState.setState({ isSynced: true });
    const { getByText, getByPlaceholderText, getByTestId, queryByText } =
      render(
        <>
          <SendBitcoin />
          <GlobalPopup />
        </>,
      );
    const addressInput = getByPlaceholderText("bc1q ...");
    fireEvent.changeText(
      addressInput,
      "bcrt1qm50khyunelhjzhckvgy3qj0hn7xjzzwljhfgd0",
    );
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const customFeeButton = getByText("custom: ");
    fireEvent.press(customFeeButton);

    const customFeeInput = getByTestId("input-custom-fees");
    fireEvent.changeText(customFeeInput, "4");

    swipeRight(getByTestId("confirmSlider"));

    await waitFor(() => {
      expect(queryByText("sending funds")).toBeTruthy();
      expect(queryByText("network fee: 1 000 sats (4 sat/vB)")).toBeTruthy();
    });
  });
  it('should navigate to "coinSelection" when clicking the list icon in the header', () => {
    const { getByAccessibilityHint } = render(<SendBitcoin />);
    const listButton = getByAccessibilityHint("go to select coins to send");
    fireEvent.press(listButton);
    expect(navigateMock).toHaveBeenCalledWith("coinSelection");
  });
});

describe("SendBitcoin - With selected coins", () => {
  const outpoint = new OutPoint(confirmed1.txid, 0);
  const amount = 10000;
  const txOut = new TxOut(amount, new Script("address"));
  const utxo = new LocalUtxo(outpoint, txOut, false, KeychainKind.External);

  beforeAll(() => {
    const wallet = createWalletFromBase58(account1.base58, getNetwork());
    setPeachWallet(new PeachWallet({ wallet }));
    peachWallet.wallet = new Wallet();
    walletListUnspentMock.mockResolvedValue([utxo]);
  });

  beforeEach(() => {
    useWalletState.setState({
      selectedUTXOIds: [getUTXOId(utxo)],
      addressLabelMap: { address: "addressLabel" },
    });
  });
  it("should render correctly", async () => {
    const { toJSON } = render(<SendBitcoin />);

    await waitFor(() => {
      expect(queryClient.getQueryData(walletKeys.utxos())).toStrictEqual([
        utxo,
      ]);
      expect(
        queryClient.getQueryData(walletKeys.utxoAddress(utxo.txout.script.id)),
      ).toBe("address");
    });
    const withSelectedCoins = toJSON();

    act(() => {
      useWalletState.setState({ selectedUTXOIds: [] });
    });
    const withoutSelectedCoins = render(<SendBitcoin />).toJSON();

    expect(withoutSelectedCoins).toMatchDiffSnapshot(withSelectedCoins);
  });
  it('should set the amount to the sum of all selected coins when clicking "send max"', async () => {
    const { toJSON, getByText } = render(<SendBitcoin />);

    await waitFor(() => {
      expect(queryClient.getQueryData(walletKeys.utxos())).toStrictEqual([
        utxo,
      ]);
    });

    const noAmount = toJSON();
    const sendMaxButton = getByText("send max");

    fireEvent.press(sendMaxButton);
    const maxAmount = toJSON();

    expect(noAmount).toMatchDiffSnapshot(maxAmount);
  });
  it("should not allow entering an amount higher than the sum of all selected coins", async () => {
    const { toJSON, getByText } = render(<SendBitcoin />);

    await waitFor(() => {
      expect(queryClient.getQueryData(walletKeys.utxos())).toStrictEqual([
        utxo,
      ]);
    });

    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "123456789");
    expect(render(<SendBitcoin />).toJSON()).toMatchDiffSnapshot(toJSON());
  });
});
