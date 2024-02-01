import { render } from "test-utils";
import { Contact } from "./Contact";

describe("Contact", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<Contact />);

    expect(toJSON()).toMatchSnapshot();
  });
});
