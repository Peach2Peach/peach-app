import { renderHook, responseUtils, waitFor } from "test-utils";
import { account1 } from "../../../../tests/unit/data/accountData";
import { updateAccount } from "../../../utils/account/updateAccount";
import { peachAPI } from "../../../utils/peachAPI";
import { useCreateEscrow } from "./useCreateEscrow";

jest.useFakeTimers();

const createEscrowMock = jest.spyOn(peachAPI.private.offer, "createEscrow");

const showErrorBannerMock = jest.fn();
jest.mock("../../../hooks/useShowErrorBanner");
jest
  .requireMock("../../../hooks/useShowErrorBanner")
  .useShowErrorBanner.mockReturnValue(showErrorBannerMock);

describe("useCreateEscrow", () => {
  beforeEach(async () => {
    await updateAccount(account1, true);
  });
  it("sends API request to create escrow", async () => {
    const { result } = renderHook(useCreateEscrow);
    result.current.mutate(["38"]);
    await waitFor(() => expect(result.current.isPending).toBeFalsy());
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: "38",
      publicKey:
        "029d3a758589d86eaeccb6bd50dd91b4846ec558bde201999c8e3dee203a892c57",
    });
  });
  it("sends API requests to create multiple escrows", async () => {
    const { result } = renderHook(useCreateEscrow);
    result.current.mutate(["38", "39"]);
    await waitFor(() => expect(result.current.isPending).toBeFalsy());
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: "38",
      publicKey:
        "029d3a758589d86eaeccb6bd50dd91b4846ec558bde201999c8e3dee203a892c57",
    });
    expect(createEscrowMock).toHaveBeenCalledWith({
      offerId: "39",
      publicKey:
        "02290455989c5c5d4ba248a9f137ff83a6fb9961988cea868d8491e9f7e0447595",
    });
  });
  it("shows error banner on API errors", async () => {
    createEscrowMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useCreateEscrow);
    result.current.mutate(["38"]);
    await waitFor(() => expect(result.current.isPending).toBeFalsy());
    expect(showErrorBannerMock).toHaveBeenCalledWith("UNAUTHORIZED");
  });
});
