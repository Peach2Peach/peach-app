import { render } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { ContractActions } from "./ContractActions";

jest.mock("./context/useContractContext");
const useContractContextMock = jest
  .requireMock("./context/useContractContext")
  .useContractContext.mockReturnValue({
    contract,
  });

jest.useFakeTimers();

describe("ContractActions", () => {
  beforeAll(() => {
    setRouteMock({
      name: "contract",
      key: "contract",
      params: { contractId: "contractId" },
    });
  });
  it("should show the paymentTooLate sliders for the seller", () => {
    jest.spyOn(Date, "now").mockImplementation(() => new Date(1).getTime());
    useContractContextMock.mockReturnValue({
      contract: {
        ...contract,
        paymentExpectedBy: new Date(0),
        paymentMade: null,
        tradeStatus: "paymentTooLate",
      },
      view: "seller",
    });
    const { toJSON } = render(<ContractActions />);
    expect(toJSON()).toMatchSnapshot();
  });
});
