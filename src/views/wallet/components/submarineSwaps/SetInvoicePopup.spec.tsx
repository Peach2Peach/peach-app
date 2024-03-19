import { fireEvent, render, waitFor } from "test-utils";
import { lightningInvoice } from "../../../../../tests/unit/data/lightningNetworkData";
import { SetInvoicePopup } from "./SetInvoicePopup";

jest.mock("@breeztech/react-native-breez-sdk");
jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .receivePayment.mockReturnValue({
    lnInvoice: {
      bolt11: lightningInvoice,
    },
  });

const swapOutMock = jest.fn();
jest.mock("./hooks/useSwapOut");
const useSwapOutMock = jest
  .requireMock("./hooks/useSwapOut")
  .useSwapOut.mockReturnValue({
    swapOut: swapOutMock,
  });

describe("SetInvoicePopup", () => {
  it("should show loading while lightningwallet generates invoice", () => {
    const { toJSON } = render(
      <SetInvoicePopup amount={12345} miningFees={210} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show show prefilled invoice field", async () => {
    const { toJSON, getByPlaceholderText, getByTestId } = render(
      <SetInvoicePopup amount={12345} miningFees={210} />,
    );
    await waitFor(() =>
      expect(
        getByPlaceholderText("lightning invoice").props.value.length > 0,
      ).toBeTruthy(),
    );
    await waitFor(() =>
      expect(getByTestId("popup-action-swapOut").props.style.opacity).toEqual(
        1,
      ),
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should start swap out with invoice", async () => {
    const { getByText, getByPlaceholderText } = render(
      <SetInvoicePopup amount={12345} miningFees={210} />,
    );
    await waitFor(() =>
      expect(
        getByPlaceholderText("lightning invoice").props.value,
      ).toBeDefined(),
    );
    expect(useSwapOutMock).toHaveBeenCalledWith({
      miningFees: 210,
      invoice: lightningInvoice,
    });
    fireEvent.press(getByText("swap"));
    expect(swapOutMock).toHaveBeenCalled();
  });
});
