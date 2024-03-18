import ShallowRenderer from "react-test-renderer/shallow";
import { LightningInvoice } from "./LightningInvoice";

describe("LightningInvoice", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly", () => {
    renderer.render(<LightningInvoice invoice={"lnbc1p..."} />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
  it("should render correctly for small screens", () => {
    const windowDimensionsSpy = jest.spyOn(
      jest.requireActual("react-native"),
      "useWindowDimensions",
    );
    windowDimensionsSpy.mockReturnValueOnce({ width: 320, height: 400 });
    renderer.render(<LightningInvoice invoice={"lnbc1p..."} />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
