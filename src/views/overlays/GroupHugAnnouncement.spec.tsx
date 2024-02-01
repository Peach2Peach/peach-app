import { render } from "test-utils";
import { GroupHugAnnouncement } from "./GroupHugAnnouncement";

describe("GroupHugAnnouncement", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<GroupHugAnnouncement offerId="1234" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
