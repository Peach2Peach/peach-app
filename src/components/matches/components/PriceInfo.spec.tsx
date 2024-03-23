import { render } from "test-utils";
import { PriceInfo } from "./PriceInfo";

describe("PriceInfo", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <PriceInfo
        {...{
          amount: 1000,
          price: 100,
          currency: "EUR",
          premium: 1,
          chain: "bitcoin",
        }}
      />,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
