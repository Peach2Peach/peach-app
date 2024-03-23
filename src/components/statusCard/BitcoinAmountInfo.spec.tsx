import { render } from "test-utils";
import { BitcoinAmountInfo } from "./BitcoinAmountInfo";

describe("BitcoinAmountInfo", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <BitcoinAmountInfo
        {...{
          amount: 1000,
          premium: 1,
          chain: "bitcoin",
        }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
