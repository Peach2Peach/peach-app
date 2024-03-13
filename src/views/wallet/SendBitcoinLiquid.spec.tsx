/* eslint-disable no-magic-numbers */
import { Provider } from "jotai";
import { Transaction as LiquidTransaction } from "liquidjs-lib";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { fireEvent, render, waitFor } from "test-utils";
import { getResult } from "../../../peach-api/src/utils/result";
import { utxo } from "../../../tests/unit/data/liquidBlockExplorerData";
import {
  liquidAddresses,
  liquidTransactionHex,
} from "../../../tests/unit/data/liquidNetworkData";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { swipeRight } from "../../../tests/unit/helpers/fireSwipeEvent";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { PeachLiquidJSWallet } from "../../utils/wallet/PeachLiquidJSWallet";
import { getLiquidNetwork } from "../../utils/wallet/getLiquidNetwork";
import { setLiquidWallet } from "../../utils/wallet/setWallet";
import { useLiquidWalletState } from "../../utils/wallet/useLiquidWalletState";
import { SendBitcoinLiquid } from "./SendBitcoinLiquid";
expect.extend({ toMatchDiffSnapshot });

jest.useFakeTimers();

const transaction = LiquidTransaction.fromHex(liquidTransactionHex);
jest
  .requireMock("../../utils/wallet/liquid/buildTransaction")
  .buildTransaction.mockReturnValue(transaction);

jest
  .requireMock("../../utils/liquid/getUTXO")
  .getUTXO.mockImplementation(getResult([]));
jest.useFakeTimers();

describe("SendBitcoinLiquid", () => {
  const peachLiquidWallet = new PeachLiquidJSWallet({
    wallet: createTestWallet(),
    network: getLiquidNetwork(),
  });
  beforeEach(() => {
    setLiquidWallet(peachLiquidWallet);
    useLiquidWalletState.getState().setBalance(utxo.value);
    useLiquidWalletState
      .getState()
      .setUTXO(
        [utxo].map((u) => ({ ...u, derivationPath: "m/84'/1'/0'/0/0" })),
      );
  });
  afterEach(() => {
    useLiquidWalletState.getState().reset();
  });

  it("should render correctly", () => {
    const { toJSON } = render(<SendBitcoinLiquid />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should update the address on change", () => {
    const { toJSON, getByPlaceholderText } = render(<SendBitcoinLiquid />);
    const addressInput = getByPlaceholderText(
      "form.address.liquid.placeholder",
    );
    fireEvent.changeText(addressInput, "test");
    expect(render(<SendBitcoinLiquid />).toJSON()).toMatchDiffSnapshot(
      toJSON(),
    );
  });
  it("should update the amount on change", () => {
    useLiquidWalletState.getState().setBalance(21000000);
    const { toJSON, getByText } = render(<SendBitcoinLiquid />);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    expect(render(<SendBitcoinLiquid />).toJSON()).toMatchDiffSnapshot(
      toJSON(),
    );
  });
  it('should set the amount to the peach liquid wallet balance when clicking "send max"', () => {
    useLiquidWalletState.getState().setBalance(21000000);
    const { toJSON, getByText } = render(<SendBitcoinLiquid />);
    const sendMaxButton = getByText("send max");
    fireEvent.press(sendMaxButton);
    expect(render(<SendBitcoinLiquid />).toJSON()).toMatchDiffSnapshot(
      toJSON(),
    );
  });
  it("should not allow entering an amount higher than the available balance", () => {
    useLiquidWalletState.getState().setBalance(21000000);
    const { toJSON, getByText } = render(<SendBitcoinLiquid />);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "123456789");
    expect(render(<SendBitcoinLiquid />).toJSON()).toMatchDiffSnapshot(
      toJSON(),
    );
  });
  it("should update the fee rate on change", () => {
    const { toJSON, getByText } = render(<SendBitcoinLiquid />);
    const mediumFeeButton = getByText("~ 30 minutes  (6 sat/vB)");
    fireEvent.press(mediumFeeButton);
    expect(render(<SendBitcoinLiquid />).toJSON()).toMatchDiffSnapshot(
      toJSON(),
    );
  });
  it("should should the help popup when clicking on the questionmark in the header", () => {
    const { getByAccessibilityHint, queryByText } = render(
      <>
        <SendBitcoinLiquid />
        <GlobalPopup />
      </>,
    );

    const helpButton = getByAccessibilityHint("help");
    fireEvent.press(helpButton);

    expect(queryByText("help")).toBeTruthy();
  });

  it("should open the confirmation popup when swiping the slider", async () => {
    const { getByTestId, getByText, getByPlaceholderText, queryByText } =
      render(
        <>
          <SendBitcoinLiquid />
          <GlobalPopup />
        </>,
      );

    const addressInput = getByPlaceholderText(
      "form.address.liquid.placeholder",
    );
    fireEvent.changeText(addressInput, liquidAddresses.regtest[0]);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const mediumFeeButton = getByText("~ 30 minutes  (6 sat/vB)");
    fireEvent.press(mediumFeeButton);

    const slider = getByTestId("confirmSlider");

    swipeRight(slider);

    await waitFor(() => {
      expect(queryByText("sending funds")).toBeTruthy();
    });
  });
  it("should disable the slider while the form is invalid", () => {
    const { getByTestId, queryByText } = render(
      <Provider>
        <SendBitcoinLiquid />
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
          <SendBitcoinLiquid />
          <GlobalPopup />
        </Provider>,
      );
    const addressInput = getByPlaceholderText(
      "form.address.liquid.placeholder",
    );
    fireEvent.changeText(addressInput, liquidAddresses.regtest[0]);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const customFeeButton = getByText("custom: ");
    fireEvent.press(customFeeButton);

    swipeRight(getByTestId("confirmSlider"));
    expect(queryByText("sending funds")).toBeFalsy();
  });
  it("should update the custom fee rate on change", async () => {
    const { getByText, getByPlaceholderText, getByTestId, queryByText } =
      render(
        <>
          <SendBitcoinLiquid />
          <GlobalPopup />
        </>,
      );
    const addressInput = getByPlaceholderText(
      "form.address.liquid.placeholder",
    );
    fireEvent.changeText(addressInput, liquidAddresses.regtest[0]);
    const amountInput = getByText("0");
    fireEvent.changeText(amountInput, "1234");
    const customFeeButton = getByText("custom: ");
    fireEvent.press(customFeeButton);

    const customFeeInput = getByTestId("input-custom-fees");
    fireEvent.changeText(customFeeInput, "4");

    swipeRight(getByTestId("confirmSlider"));

    await waitFor(() => {
      expect(queryByText("sending funds")).toBeTruthy();
      expect(queryByText("network fee: 1 028 sats (4 sat/vB)")).toBeTruthy();
    });
  });
});
