import ShallowRenderer from "react-test-renderer/shallow";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { BitcoinAddress } from "./BitcoinAddress";

describe("BitcoinAddress", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly", () => {
    renderer.render(<BitcoinAddress address={sellOffer.returnAddress} />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
  it("should render correctly for small screens", () => {
    const windowDimensionsSpy = jest.spyOn(
      jest.requireActual("react-native"),
      "useWindowDimensions",
    );
    windowDimensionsSpy.mockReturnValueOnce({ width: 320, height: 400 });
    renderer.render(<BitcoinAddress address={sellOffer.returnAddress} />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
