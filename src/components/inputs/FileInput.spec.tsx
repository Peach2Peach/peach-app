import { render } from "test-utils";
import { FileInput } from "./FileInput";

jest.mock("./Input", () => ({
  Input: "Input",
}));

describe("FileInput", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<FileInput />);
    expect(toJSON()).toMatchSnapshot();
  });
});
