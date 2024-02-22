import { render, responseUtils, waitFor } from "test-utils";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../../utils/peachAPI";
import { NetworkFees } from "./NetworkFees";

jest.mock("./useNetworkFeesSetup", () => ({
  useNetworkFeesSetup: jest.fn().mockReturnValue({
    selectedFeeRate: "fastestFee",
    setSelectedFeeRate: jest.fn(),
    customFeeRate: "5",
    setCustomFeeRate: jest.fn(),
    submit: jest.fn(),
    isValid: true,
    feeRateSet: false,
  }),
}));

const estimatedFees = {
  fastestFee: 5,
  halfHourFee: 4,
  hourFee: 3,
  economyFee: 2,
  minimumFee: 1,
};

jest.spyOn(peachAPI.public.bitcoin, "getFeeEstimate").mockResolvedValue({
  ...responseUtils,
  result: estimatedFees,
});

jest.useFakeTimers();

describe("NetworkFees", () => {
  it("should render correctly", async () => {
    const { toJSON } = render(<NetworkFees />);
    await waitFor(() => {
      expect(queryClient.getQueryData(["feeEstimate", "bitcoin"])).toStrictEqual(
        estimatedFees,
      );
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
