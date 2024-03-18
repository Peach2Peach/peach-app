import { createRenderer } from "react-test-renderer/shallow";
import { ConfirmationSummaryItem } from "./ConfirmationSummaryItem";

describe("ConfirmationSummaryItem", () => {
  const renderer = createRenderer();
  it("renders correctly when pending", () => {
    renderer.render(<ConfirmationSummaryItem />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly when confirmed", () => {
    renderer.render(<ConfirmationSummaryItem confirmed />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("renders correctly when failed", () => {
    renderer.render(<ConfirmationSummaryItem failed />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
