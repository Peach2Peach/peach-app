import { render, responseUtils, waitFor } from "test-utils";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { offerKeys } from "../../hooks/query/useOfferDetail";
import { peachAPI } from "../../utils/peachAPI";
import { EditPremium } from "./EditPremium";

jest.useFakeTimers();

jest.spyOn(peachAPI.public.market, "marketPrices").mockResolvedValue({
  result: {
    EUR: 100000,
  },
  ...responseUtils,
});

describe("EditPremium", () => {
  beforeAll(() => {
    setRouteMock({
      name: "editPremium",
      key: "editPremium",
      params: { offerId: "123" },
    });
  });
  it("should render correctly", async () => {
    const { toJSON } = render(<EditPremium />);
    await waitFor(() => {
      expect(queryClient.getQueryState(offerKeys.detail("123"))?.status).toBe(
        "success",
      );
      expect(queryClient.getQueryState(["marketPrices"])?.status).toBe(
        "success",
      );
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
