import { render, waitFor } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { getResult } from "../../../peach-api/src/utils/result";
import { setRouteMock } from "../../../tests/unit/helpers/NavigationWrapper";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { ContractChat } from "./ContractChat";

const getContractQuery = jest
  .spyOn(peachAPI.private.contract, "getContract")
  .mockResolvedValue(getResult(contract));

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
    getContractQuery.mockResolvedValueOnce(
      getResult({ ...contract, isChatActive: false }),
    );
    const { toJSON } = render(<ContractChat />);
    await waitFor(() => {
      expect(queryClient.isFetching()).toBe(0);
    });
    expect(toJSON()).toMatchSnapshot();
  });
});
