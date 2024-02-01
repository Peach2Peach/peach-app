import { render } from "test-utils";
import {
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1,
} from "../../../../../tests/unit/data/transactionDetailData";
import { OfferData } from "./OfferData";

jest.useFakeTimers();

describe("OfferData", () => {
  it("should render correctly", () => {
    const { toJSON } = render(
      <OfferData
        price={123}
        currency="EUR"
        amount={10000}
        address={transactionWithRBF1.vout[0].scriptpubkey_address}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        type="WITHDRAWAL"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly without price, currency and address", () => {
    const { toJSON } = render(
      <OfferData
        amount={100000}
        transactionDetails={bitcoinJSTransactionWithRBF1}
        type="WITHDRAWAL"
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
