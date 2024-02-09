import { render } from "test-utils";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { Welcome } from "./Welcome";

describe("Welcome", () => {
  it("should render correctly", () => {
    useSettingsStore.getState().setUsedReferralCode(true);

    const { toJSON } = render(<Welcome />);
    expect(toJSON()).toMatchSnapshot();
  });
});
