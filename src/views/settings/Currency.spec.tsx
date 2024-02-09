import { render } from "test-utils";
import { Currency } from "./Currency";

describe("Currency", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<Currency />);
    expect(toJSON()).toMatchSnapshot();
  });
});
