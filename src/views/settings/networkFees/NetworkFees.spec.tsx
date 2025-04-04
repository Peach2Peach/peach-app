import { render, responseUtils, waitFor } from "test-utils";
import { defaultUser } from "../../../../peach-api/src/testData/userData";
import { queryClient } from "../../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../../utils/peachAPI";
import { NetworkFees } from "./NetworkFees";

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
jest.spyOn(peachAPI.private.user, "getSelfUser").mockResolvedValue({
  ...responseUtils,
  result: {
    ...defaultUser,
    feeRate: 5,
  },
});

jest.useFakeTimers();

describe("NetworkFees", () => {
  it("should render correctly", async () => {
    const { toJSON } = render(<NetworkFees />);
    await waitFor(() => {
      expect(queryClient.getQueryData(["feeEstimate"])).toStrictEqual(
        estimatedFees,
      );
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
