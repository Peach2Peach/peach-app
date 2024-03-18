import { toMatchDiffSnapshot } from "snapshot-diff";
import { render } from "test-utils";
import { BTCAmount } from "./BTCAmount";
expect.extend({ toMatchDiffSnapshot });

describe("BTCAmount", () => {
  const amount = 21000;
  const defaultBTCAmount = <BTCAmount amount={amount} size="large" />;
  it("should render correctly for large size", () => {
    const { toJSON } = render(defaultBTCAmount);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly for medium size", () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="medium" />);
    expect(render(defaultBTCAmount).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly for small size", () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="small" />);
    expect(render(defaultBTCAmount).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly for different chain", () => {
    const { toJSON } = render(
      <BTCAmount chain="liquid" amount={amount} size="medium" />,
    );
    expect(render(defaultBTCAmount).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly with white", () => {
    const { toJSON } = render(<BTCAmount amount={amount} size="large" white />);
    expect(render(defaultBTCAmount).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly when the value is 0", () => {
    const { toJSON } = render(<BTCAmount amount={0} size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when showAmount is false", () => {
    const { toJSON } = render(
      <BTCAmount amount={amount} size="large" showAmount={false} />,
    );
    expect(render(defaultBTCAmount).toJSON()).toMatchDiffSnapshot(toJSON());
  });
  it("should render correctly when the amount has 6 digits", () => {
    // trailing whitespaces get removed if they are in the first text node so we add it to the second one
    const { toJSON } = render(<BTCAmount amount={123456} size="large" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
