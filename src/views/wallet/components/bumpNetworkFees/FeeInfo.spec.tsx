import { render } from "test-utils";
import { FeeInfo } from "./FeeInfo";

describe("FeeInfo", () => {
  it("rounds fees", () => {
    const { getByText } = render(<FeeInfo label="label" fee={2.1222} />);
    expect(getByText("2.12 sat/vB")).toBeDefined();
  });
});
