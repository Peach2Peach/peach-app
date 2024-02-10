import { fireEvent, render } from "test-utils";
import { feeEstimates } from "../../../../../tests/unit/data/electrumData";
import { pending1 } from "../../../../../tests/unit/data/transactionDetailData";
import { GlobalPopup } from "../../../../components/popup/GlobalPopup";
import { placeholderFeeEstimates } from "../../../../hooks/query/useFeeEstimates";
import { TransactionETASummaryItem } from "./TransactionETASummaryItem";

jest.mock("../../../../hooks/query/useFeeEstimates", () => ({
  ...jest.requireActual("../../../../hooks/query/useFeeEstimates"),
  useFeeEstimates: jest.fn(),
}));
const useFeeEstimatesMock = jest
  .requireMock("../../../../hooks/query/useFeeEstimates")
  .useFeeEstimates.mockReturnValue({ feeEstimates: placeholderFeeEstimates });

jest.mock("../../hooks/useTxFeeRate", () => ({
  useTxFeeRate: jest.fn().mockReturnValue({ data: 2 }),
}));

describe("TransactionETA", () => {
  it("should render correctly for 1 block ETA", () => {
    const { toJSON } = render(
      <TransactionETASummaryItem transaction={pending1} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for more than 1 block ETA", () => {
    useFeeEstimatesMock.mockReturnValueOnce({ feeEstimates });

    const { toJSON } = render(
      <TransactionETASummaryItem transaction={pending1} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("should open help popup", () => {
    const { getByText } = render(
      <>
        <TransactionETASummaryItem transaction={pending1} />
        <GlobalPopup />
      </>,
    );
    fireEvent.press(getByText("in 1 block"));
    expect(getByText("confirmation time")).toBeTruthy();
  });
});
