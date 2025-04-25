import { createRenderer } from "react-test-renderer/shallow";
import { TransactionIcon } from "./TransactionIcon";

describe("TransactionIcon", () => {
  const renderer = createRenderer();

  it("should render correctly for type TRADE", () => {
    renderer.render(<TransactionIcon type="TRADE" size={20} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for type ESCROWFUNDED", () => {
    renderer.render(<TransactionIcon type="ESCROWFUNDED" size={20} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for type WITHDRAWAL", () => {
    renderer.render(<TransactionIcon type="WITHDRAWAL" size={20} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for type DEPOSIT", () => {
    renderer.render(<TransactionIcon type="DEPOSIT" size={20} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
  it("should render correctly for type REFUND", () => {
    renderer.render(<TransactionIcon type="REFUND" size={20} />);
    expect(renderer.getRenderOutput()).toMatchSnapshot();
  });
});
