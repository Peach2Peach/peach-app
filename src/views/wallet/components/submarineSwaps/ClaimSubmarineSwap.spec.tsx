import ecc from "@bitcoinerlab/secp256k1";
import ECPairFactory from "ecpair";
import { networks } from "liquidjs-lib";
import { toMatchDiffSnapshot } from "snapshot-diff";
import { render } from "test-utils";
import { submarineSwapResponse } from "../../../../../tests/unit/data/boltzData";
import { createTestWallet } from "../../../../../tests/unit/helpers/createTestWallet";
import { PeachLiquidJSWallet } from "../../../../utils/wallet/PeachLiquidJSWallet";
import { setLiquidWallet } from "../../../../utils/wallet/setWallet";
import { ClaimSubmarineSwap } from "./ClaimSubmarineSwap";
const ECPair = ECPairFactory(ecc);

expect.extend({ toMatchDiffSnapshot });

const startSwapOutMock = jest.fn()
jest.mock("./hooks/useStartSwapOut");
jest.requireMock("./hooks/useStartSwapOut").useStartSwapOut.mockReturnValue(startSwapOutMock)

const peachWallet = new PeachLiquidJSWallet({ wallet: createTestWallet() });
setLiquidWallet(peachWallet);

describe("ClaimSubmarineSwap", () => {
  const swapInfo = submarineSwapResponse
  const invoice = 'invoice'
  const keyPairWIF= ECPair.makeRandom({network: networks.regtest}).toWIF()

  it("should render correctly", () => {
    const { toJSON } = render(<ClaimSubmarineSwap {...{ swapInfo, invoice, keyPairWIF }} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
