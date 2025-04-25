import { BitcoinLoading } from "./BitcoinLoading";
import { createRenderer } from "react-test-renderer/shallow";

describe("BitcoinLoading", () => {
  const renderer = createRenderer();
  it("should render correctly", () => {
    renderer.render(
      <BitcoinLoading text="we are bootstrapping a new financial system" />,
    );
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
