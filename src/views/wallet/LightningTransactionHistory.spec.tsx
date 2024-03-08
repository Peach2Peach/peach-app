import { render, waitFor } from "test-utils";
import { lnPayment } from "../../../tests/unit/data/lightningNetworkData";
import { LightningTransactionHistory } from "./LightningTransactionHistory";

jest.mock("@breeztech/react-native-breez-sdk");
const listPaymentsMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .listPayments.mockResolvedValue([]);

jest.useFakeTimers();

describe("LightningTransactionHistory", () => {
  it("should render correctly when empty", () => {
    const { toJSON } = render(<LightningTransactionHistory />);

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with tx", async () => {
    listPaymentsMock.mockResolvedValueOnce([lnPayment]);
    const { toJSON, getByText } = render(<LightningTransactionHistory />);
    await waitFor(() => expect(getByText("sent")).toBeDefined());
    expect(toJSON()).toMatchSnapshot();
  });
});
