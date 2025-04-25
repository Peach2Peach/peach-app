import { render, waitFor } from "test-utils";
import { BuyOfferSummary } from "../../../../peach-api/src/@types/offer";
import { account1 } from "../../../../tests/unit/data/accountData";
import { contractSummary } from "../../../../tests/unit/data/contractSummaryData";
import { offerKeys } from "../../../hooks/query/useOfferDetail";
import { queryClient } from "../../../queryClient";
import { updateAccount } from "../../../utils/account/updateAccount";
import { TradeItem } from "./TradeItem";

jest.useFakeTimers();

describe("OfferItem", () => {
  const minAmount = 21000;
  const maxAmount = 210000;
  const defaultOffer: BuyOfferSummary = {
    id: "id",
    type: "bid",
    creationDate: new Date("2021-01-01"),
    lastModified: new Date("2021-01-01"),
    amount: [minAmount, maxAmount],
    matches: [],
    tradeStatus: "searchingForPeer",
    escrowType: "bitcoin",
  };

  it("should render correctly", () => {
    const { toJSON } = render(<TradeItem item={defaultOffer} />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly if it's a past offer", () => {
    const { toJSON } = render(
      <TradeItem item={{ ...defaultOffer, tradeStatus: "tradeCompleted" }} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("ContractItem", () => {
  beforeAll(() => {
    updateAccount(account1);
  });

  it("should render correctly", () => {
    const { toJSON } = render(
      <TradeItem
        item={{ ...contractSummary, tradeStatus: "paymentRequired" }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with unread messages", () => {
    const { toJSON } = render(
      <TradeItem
        item={{
          ...contractSummary,
          tradeStatus: "paymentRequired",
          unreadMessages: 1,
        }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly with past contract", () => {
    const { toJSON } = render(
      <TradeItem
        item={{ ...contractSummary, tradeStatus: "tradeCompleted" }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when republished", async () => {
    const { toJSON } = render(
      <TradeItem item={{ ...contractSummary, newTradeId: "123" }} />,
    );
    await waitFor(() => {
      expect(queryClient.getQueryData(offerKeys.detail("123"))).toBeDefined();
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
