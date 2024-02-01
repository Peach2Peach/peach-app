import { render } from "test-utils";
import { Referrals } from "./Referrals";

jest.useFakeTimers();

describe("Referrals", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<Referrals />);

    expect(toJSON()).toMatchSnapshot();
  });
});
