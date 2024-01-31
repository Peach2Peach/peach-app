import { render } from "test-utils";
import { PriceFormat } from "./PriceFormat";

describe("PriceFormat", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<PriceFormat amount={12345.44} currency="EUR" />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly for sats", () => {
    const { toJSON } = render(<PriceFormat amount={12345} currency="SAT" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
