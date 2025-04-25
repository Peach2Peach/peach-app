import { toMatchDiffSnapshot } from "snapshot-diff";
import { render } from "test-utils";
import { BuySorters } from "./BuySorters";
expect.extend({ toMatchDiffSnapshot });

jest.useFakeTimers();

const defaultComponent = <BuySorters />;
describe("BuySorters", () => {
  it("should render correctly", () => {
    const { toJSON } = render(defaultComponent);
    expect(toJSON()).toMatchSnapshot();
  });
});
