import { render } from "test-utils";
import { createTestWallet } from "../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../utils/wallet/PeachLiquidJSWallet";
import { getLiquidNetwork } from "../../utils/wallet/getLiquidNetwork";
import { setLiquidWallet } from "../../utils/wallet/setWallet";
import { ReceiveBitcoinLiquid } from "./ReceiveBitcoinLiquid";

jest.useFakeTimers();

const addresses: { index: number; address: string }[] = [
  { index: 0, address: "firstAddress" },
  { index: 1, address: "secondAddress" },
  { index: 2, address: "thirdAddress" },
];

describe("ReceiveBitcoinLiquid", () => {
  const peachLiquidWallet = new PeachLiquidJSWallet({
    wallet: createTestWallet(),
    network: getLiquidNetwork(),
  });
  beforeEach(() => {
    setLiquidWallet(peachLiquidWallet);
  });

  it("should render correctly while loading", () => {
    const { toJSON } = render(<ReceiveBitcoinLiquid />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render correctly when loaded", () => {
    jest
      .spyOn(peachLiquidWallet, "getAddress")
      .mockImplementation(
        (index?: number) => addresses[index || addresses.length - 1],
      );
    const { toJSON } = render(<ReceiveBitcoinLiquid />);

    expect(toJSON()).toMatchSnapshot();
  });
});
