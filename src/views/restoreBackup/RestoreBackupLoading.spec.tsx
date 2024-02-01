import { render } from "test-utils";
import { RestoreBackupLoading } from "./RestoreBackupLoading";

describe("RestoreBackupLoading", () => {
  it("should render correctly", () => {
    const { toJSON } = render(<RestoreBackupLoading />);
    expect(toJSON()).toMatchSnapshot();
  });
});
