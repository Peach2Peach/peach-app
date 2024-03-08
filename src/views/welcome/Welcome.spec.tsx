import { render } from "test-utils";
import { Welcome } from "./Welcome";

describe("Welcome", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<Welcome />);
    expect(toJSON()).toMatchSnapshot();
  });
});
