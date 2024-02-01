import { toMatchDiffSnapshot } from "snapshot-diff";
import { render } from "test-utils";
import { ProfileInfo } from "./ProfileInfo";
expect.extend({ toMatchDiffSnapshot });

describe("ProfileInfo", () => {
  const defaultComponent = (
    <ProfileInfo
      user={{ id: "123", rating: 1, openedTrades: 21, medals: ["ambassador"] }}
    />
  );
  it("renders correctly", () => {
    const { toJSON } = render(defaultComponent);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders correctly for a new user", () => {
    const { toJSON } = render(
      <ProfileInfo
        user={{ id: "123", rating: 1, openedTrades: 2, medals: ["ambassador"] }}
      />,
    );
    expect(render(defaultComponent).toJSON()).toMatchDiffSnapshot(toJSON());
  });
});
