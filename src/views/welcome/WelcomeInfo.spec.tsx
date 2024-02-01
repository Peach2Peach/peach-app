import { render } from "test-utils";
import { WelcomeInfo } from "./WelcomeInfo";

describe("WelcomeInfo - peachOfMind", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<WelcomeInfo name="peachOfMind" />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("WelcomeInfo - peerToPeer", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<WelcomeInfo name="peerToPeer" />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("WelcomeInfo - privacyFirst", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<WelcomeInfo name="privacyFirst" />);
    expect(toJSON()).toMatchSnapshot();
  });
});

describe("WelcomeInfo - aWalletYouControl", () => {
  it("renders correctly", () => {
    const { toJSON } = render(<WelcomeInfo name="aWalletYouControl" />);
    expect(toJSON()).toMatchSnapshot();
  });
});
