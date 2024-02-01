import { createRenderer } from "react-test-renderer/shallow";
import { useOfferPreferences } from "../../../store/offerPreferenes";
import { FundMultipleOffers } from "./FundMultipleOffers";

describe("FundMultipleOffers", () => {
  const renderer = createRenderer();
  it("renders correctly when disabled", () => {
    renderer.render(<FundMultipleOffers />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly when enabled", () => {
    const amountOfOffers = 4;
    useOfferPreferences.getState().setMulti(amountOfOffers);
    renderer.render(<FundMultipleOffers />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
