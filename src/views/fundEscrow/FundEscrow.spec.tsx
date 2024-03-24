import { render } from "test-utils";
import { sellOffer } from "../../../tests/unit/data/offerData";
import { getDefaultFundingStatus } from "../../utils/offer/constants";
import { FundEscrow } from "./FundEscrow";

jest.mock("./hooks/useFundEscrowSetup");
const useFundEscrowSetupMock = jest.requireMock(
  "./hooks/useFundEscrowSetup",
).useFundEscrowSetup;
jest.mock("./hooks/useFundFromPeachWallet");
const useFundFromPeachWalletMock = jest
  .requireMock("./hooks/useFundFromPeachWallet")
  .useFundFromPeachWallet.mockReturnValue({
    fundFromPeachWallet: jest.fn(),
    fundedFromPeachWallet: false,
  });

describe("FundEscrow", () => {
  const activeFunding = {
    fundingAddress: sellOffer.returnAddress,
    fundingAddresses: [],
    fundingStatus: getDefaultFundingStatus(sellOffer.id),
  };
  const defaultReturnValue = {
    fundingMechanism: "bitcoin",
    offerId: sellOffer.id,
    offer: sellOffer,
    funding: {
      bitcoin: activeFunding,
      liquid: {
        fundingAddress: sellOffer.escrows.liquid,
        fundingAddresses: [],
        fundingStatus: getDefaultFundingStatus(sellOffer.id),
      },
    },
    activeFunding,
    fundingAmount: 100000,
    createEscrowError: null,
    offerIdsWithoutEscrow: 0,
  };

  it("should render the FundEscrow view", () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue);
    const { toJSON } = render(<FundEscrow />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show Loading, while escrow is not defined", () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingAddress: undefined,
    });
    const { toJSON } = render(<FundEscrow />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should show funded from peach wallet, if funded from peach wallet", () => {
    useFundEscrowSetupMock.mockReturnValueOnce(defaultReturnValue);
    useFundFromPeachWalletMock.mockReturnValueOnce({
      fundFromPeachWallet: jest.fn(),
      fundedFromPeachWallet: true,
    });
    const { toJSON } = render(<FundEscrow />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("should show TransactionInMempool, if fundingStatus is MEMPOOL", () => {
    useFundEscrowSetupMock.mockReturnValueOnce({
      ...defaultReturnValue,
      fundingStatus: {
        ...getDefaultFundingStatus(sellOffer.id),
        status: "MEMPOOL",
        txIds: ["txId"],
      },
    });
    const { toJSON } = render(<FundEscrow />);

    expect(toJSON()).toMatchSnapshot();
  });
});
