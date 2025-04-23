import { render } from "test-utils";
import { Flag } from "./Flag";

describe("Flag", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<Flag id="DE" />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when flag is not found", () => {
    const { toJSON } = render(<Flag id="XX" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
