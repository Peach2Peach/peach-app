import { PaymentType } from "@breeztech/react-native-breez-sdk";
import { render, waitFor } from "test-utils";
import {
  lightningInvoice,
  lnPayment,
} from "../../../tests/unit/data/lightningNetworkData";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { TransactionDetailsLightning } from "./TransactionDetailsLightning";

jest.mock("@breeztech/react-native-breez-sdk");
const paymentByHashMock = jest
  .requireMock("@breeztech/react-native-breez-sdk")
  .paymentByHash.mockResolvedValue(lnPayment);

jest.useFakeTimers();

describe("TransactionDetailsLightning", () => {
  beforeAll(() => {
    setRouteMock({
      name: "transactionDetailsLightning",
      key: "transactionDetailsLightning",
      params: {
        invoice: lightningInvoice,
      },
    });
  });
  afterEach(() => {
    queryClient.clear();
  });
  it("should render correctly while loading", () => {
    paymentByHashMock.mockResolvedValueOnce(undefined);
    const { toJSON } = render(<TransactionDetailsLightning />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with outgoing payment", async () => {
    const { getByText, toJSON } = render(<TransactionDetailsLightning />);
    await waitFor(() => expect(getByText("sent from wallet")).toBeDefined());

    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with incoming payment", async () => {
    paymentByHashMock.mockResolvedValueOnce({
      ...lnPayment,
      paymentType: PaymentType.RECEIVED,
    });
    const { getByText, toJSON } = render(<TransactionDetailsLightning />);
    await waitFor(() => expect(getByText("received to wallet")).toBeDefined());

    expect(toJSON()).toMatchSnapshot();
  });
});
