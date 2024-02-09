import { render, responseUtils, waitFor } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { ContractChat } from "./ContractChat";

const getContractQuery = jest
  .spyOn(peachAPI.private.contract, "getContract")
  .mockResolvedValue({ result: contract, ...responseUtils });

jest.useFakeTimers();

describe("ContractChat", () => {
  beforeAll(() => {
    setRouteMock({
      name: "contractChat",
      key: "contractChat",
      params: { contractId: "1-2" },
    });
  });
  it("should render correct when chat enabled", async () => {
    const { toJSON } = render(<ContractChat />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    expect(toJSON()).toMatchSnapshot();
  });
  it("should render chat disabled message when disabled", async () => {
    getContractQuery.mockResolvedValueOnce({
      result: { ...contract, isChatActive: false },
      ...responseUtils,
    });
    const { toJSON } = render(<ContractChat />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
