import { render } from "test-utils";
import { match } from "../../../peach-api/src/testData/match";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { Match } from "./Match";

describe("Match", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <Match match={match} offer={sellOffer} currentPage={0} />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
