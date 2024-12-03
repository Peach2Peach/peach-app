import { render } from "test-utils";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { Report } from "./Report";

describe("Report", () => {
  beforeAll(() => {
    setRouteMock({
      name: "report",
      key: "report",
      params: {
        reason: "other",
        topic: "topic",
        message: "message",
      },
    });
  });
  it("should render correctly", () => {
    const { toJSON } = render(<Report />);
    expect(toJSON()).toMatchSnapshot();
  });
});
