import { render } from "test-utils";
import {
  buyOffer,
  matchOffer,
  sellOffer,
} from "../../../tests/unit/data/offerData";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { MatchDetails } from "./MatchDetails";

jest.mock("../../hooks/query/useOfferDetail");
const useOfferDetailMock = jest
  .requireMock("../../hooks/query/useOfferDetail")
  .useOfferDetail.mockReturnValue({
    offer: buyOffer,
  });
jest.mock("../contract/hooks/useMatchDetails");
jest
  .requireMock("../contract/hooks/useMatchDetails")
  .useMatchDetails.mockReturnValue({
    data: matchOffer,
  });

describe("MatchDetails", () => {
  beforeAll(() => {
    setRouteMock({
      name: "matchDetails",
      key: "matchDetails",
      params: {
        matchId: sellOffer.id,
        offerId: buyOffer.id,
      },
    });
  });
  it("should render while loading", () => {
    useOfferDetailMock.mockReturnValueOnce({ offer: undefined });
    const { toJSON } = render(<MatchDetails />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly", () => {
    const { toJSON } = render(<MatchDetails />);
    expect(toJSON()).toMatchSnapshot();
  });
});
