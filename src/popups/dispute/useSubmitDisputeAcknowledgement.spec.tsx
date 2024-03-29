import { Keyboard } from "react-native";
import { render, renderHook, waitFor } from "test-utils";
import { contract } from "../../../peach-api/src/testData/contract";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { GlobalPopup } from "../../components/popup/GlobalPopup";
import { contractKeys } from "../../hooks/query/useContractDetail";
import { defaultAccount, setAccount } from "../../utils/account/account";
import { peachAPI } from "../../utils/peachAPI";
import { useSubmitDisputeAcknowledgement } from "./useSubmitDisputeAcknowledgement";

const now = new Date();
jest.useFakeTimers({ now });

const mockShowErrorBanner = jest.fn();
jest.mock("../../hooks/useShowErrorBanner", () => ({
  useShowErrorBanner: () => mockShowErrorBanner,
}));

describe("useSubmitDisputeAcknowledgement", () => {
  const acknowledgeDisputeMock = jest.spyOn(
    peachAPI.private.contract,
    "acknowledgeDispute",
  );
  beforeEach(() => {
    queryClient.setQueryData(contractKeys.detail(contract.id), contract);
  });

  afterEach(() => {
    queryClient.clear();
  });

  it("returns interface", () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    expect(result.current).toBeInstanceOf(Function);
  });

  it("does nothing if email is required and invalid", async () => {
    const disputeReason = "noPayment.buyer";
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    };
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: noPaymentContract.id,
      disputeReason,
      email: "",
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });

    expect(acknowledgeDisputeMock).not.toHaveBeenCalled();
  });

  it("saves contract for seller update when successful", async () => {
    setAccount({ ...defaultAccount, publicKey: contract.seller.id });
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: contract.id,
      disputeReason: "other",
      email: "",
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });
  });
  it("saves contract for buyer update when successful", async () => {
    setAccount({ ...defaultAccount, publicKey: contract.buyer.id });
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: contract.id,
      disputeReason: "other",
      email: "",
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });
  });
  it("closes popup when successful", async () => {
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: contract.id,
      disputeReason: "other",
      email: "seller@mail.com",
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });

    const { queryByText } = render(<GlobalPopup />);
    expect(queryByText("dispute opened")).toBeFalsy();
  });
  it("closes keyboard when successful and email was required", async () => {
    const keyboardSpy = jest.spyOn(Keyboard, "dismiss");
    const disputeReason = "noPayment.buyer";
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    };
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: noPaymentContract.id,
      disputeReason,
      email: "satoshi@bitcoin.org",
    });
    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });

    expect(keyboardSpy).toHaveBeenCalled();
  });
  it("opens error banner if submit was not successful", async () => {
    const error = "NOT_FOUND";
    acknowledgeDisputeMock.mockResolvedValueOnce({
      result: undefined,
      error: { error },
      isError: () => true,
      isOk: () => false,
      getValue: () => undefined,
      getError: () => ({
        error,
      }),
    });
    const disputeReason = "noPayment.buyer";
    const noPaymentContract: Contract = {
      ...contract,
      disputeReason,
    };
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: noPaymentContract.id,
      disputeReason,
      email: "satoshi@bitcoin.org",
    });
    await waitFor(() => {
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });
    expect(mockShowErrorBanner).toHaveBeenCalledWith(error);
  });
  it("updates the isEmailRequired property on the contract", async () => {
    queryClient.setQueryData(contractKeys.detail(contract.id), {
      ...contract,
      isEmailRequired: true,
    });
    jest.spyOn(Date, "now").mockReturnValue(now.getTime());

    setAccount({ ...defaultAccount, publicKey: contract.buyer.id });
    const { result } = renderHook(useSubmitDisputeAcknowledgement);
    result.current({
      contractId: contract.id,
      disputeReason: "other",
      email: "",
    });

    await waitFor(() => {
      expect(queryClient.isMutating()).toBe(0);
      expect(
        queryClient.getQueryState(contractKeys.detail(contract.id))?.status,
      ).toBe("success");
    });

    expect(queryClient.getQueryData(contractKeys.detail(contract.id))).toEqual({
      ...contract,
      isEmailRequired: false,
    });
  });
});
