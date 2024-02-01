import { createRenderer } from "react-test-renderer/shallow";
import {
  bitcoinJSTransactionWithRBF1,
  transactionWithRBF1Summary,
} from "../../../../../tests/unit/data/transactionDetailData";
import { OutputInfo } from "./OutputInfo";

describe("OutputInfo", () => {
  const offerData = transactionWithRBF1Summary.offerData[0];
  const renderer = createRenderer();
  it("should render correctly", () => {
    renderer.render(
      <OutputInfo
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={transactionWithRBF1Summary}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with multiple offers", () => {
    renderer.render(
      <OutputInfo
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{
          ...transactionWithRBF1Summary,
          offerData: [offerData, offerData],
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly with multiple contracts", () => {
    const offerDataWithContract = {
      ...offerData,
      contractId: "123-456",
      currency: "EUR" as const,
      price: 394,
    };
    renderer.render(
      <OutputInfo
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{
          ...transactionWithRBF1Summary,
          offerData: [offerDataWithContract, offerDataWithContract],
        }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly without offerData", () => {
    renderer.render(
      <OutputInfo
        transactionDetails={bitcoinJSTransactionWithRBF1}
        transactionSummary={{ ...transactionWithRBF1Summary, offerData: [] }}
      />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
