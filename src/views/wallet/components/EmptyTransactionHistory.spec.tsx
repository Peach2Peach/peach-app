import ShallowRenderer from "react-test-renderer/shallow";
import { EmptyTransactionHistory } from "./EmptyTransactionHistory";

describe("EmptyTransactionHistory", () => {
  const renderer = ShallowRenderer.createRenderer();

  it("should render correctly", () => {
    renderer.render(<EmptyTransactionHistory />);

    const renderOutput = renderer.getRenderOutput();
    expect(renderOutput).toMatchSnapshot();
  });
});
