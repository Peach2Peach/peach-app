import { act } from "react-test-renderer";
import { renderHook, responseUtils, waitFor } from "test-utils";
import { chat1 } from "../../../tests/unit/data/chatData";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { PAGE_SIZE, useChatMessages } from "./useChatMessages";

const decryptSymmetricMock = jest.fn().mockImplementation((str) => str);
jest.mock("../../utils/pgp/decryptSymmetric", () => ({
  decryptSymmetric: (...args: unknown[]) => decryptSymmetricMock(...args),
}));

const getChatMock = jest.spyOn(peachAPI.private.contract, "getChat");

jest.useFakeTimers();
const symmetricKey = "TODO";

describe("useChatMessages", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches chat messages from API", async () => {
    const { result } = renderHook(useChatMessages, {
      initialProps: { id: chat1.id, symmetricKey },
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getChatMock).toHaveBeenCalledWith({ contractId: chat1.id, page: 0 });

    expect(result.current).toEqual({
      messages: chat1.messages.slice(0, PAGE_SIZE),
      page: 0,
      isLoading: false,
      isFetching: false,
      hasNextPage: true,
      fetchNextPage: expect.any(Function),
      refetch: expect.any(Function),
      error: null,
    });
  });
  it("handles system messages", async () => {
    const systemMessage1: Message = {
      roomId: "contract-313-312",
      from: "system",
      date: new Date("2022-09-14T16:14:02.835Z"),
      readBy: ["system"],
      message: "chat.systemMessage.mediatorWillJoinSoon",
      decrypted: true,
      signature:
        "-----BEGIN PGP SIGNATURE-----\nVersion: openpgp-mobile\n\nsig\n-----END PGP SIGNATURE-----",
    };
    const systemMessage2: Message = {
      roomId: "contract-313-312",
      from: "system",
      date: new Date("2022-09-14T16:14:02.835Z"),
      readBy: ["system"],
      message:
        "chat.systemMessage.disputeStarted.seller.noPayment.buyer::Peach12345678::buyer.noPayment",
      decrypted: true,
      signature:
        "-----BEGIN PGP SIGNATURE-----\nVersion: openpgp-mobile\n\nsig\n-----END PGP SIGNATURE-----",
    };
    getChatMock.mockResolvedValueOnce({
      result: [systemMessage1, systemMessage2],
      ...responseUtils,
    });
    const { result } = renderHook(useChatMessages, {
      initialProps: { id: chat1.id, symmetricKey },
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.messages).toEqual([
      {
        ...systemMessage1,
        message: "A Peach mediator will join the chat soon",
      },
      {
        ...systemMessage2,
        message:
          "A dispute has been started by the buyer Peach12345678 for the following reason: 'bitcoin not received'",
      },
    ]);
  });
  it("fetches next page", async () => {
    const { result } = renderHook(useChatMessages, {
      initialProps: { id: chat1.id, symmetricKey },
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBeTruthy();

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    getChatMock.mockResolvedValueOnce({
      result: chat1.messages.slice(-1),
      ...responseUtils,
    });

    await act(() => {
      result.current.fetchNextPage();
    });

    await waitFor(() =>
      expect(result.current.messages.length).toBe(chat1.messages.length),
    );
    expect(getChatMock).toHaveBeenCalledWith({ contractId: chat1.id, page: 1 });
    expect(result.current).toEqual({
      messages: chat1.messages,
      page: 1,
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: expect.any(Function),
      refetch: expect.any(Function),
      error: null,
    });
  });
});
