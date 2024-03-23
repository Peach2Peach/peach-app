import { render } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { Matches } from "./Matches";

describe("Matches", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<Matches offer={sellOffer} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
