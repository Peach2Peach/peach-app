import { renderHook, responseUtils, waitFor } from "test-utils";
import { sellOffer } from "../../../peach-api/src/testData/offers";
import { queryClient } from "../../../tests/unit/helpers/QueryClientWrapper";
import { peachAPI } from "../../utils/peachAPI";
import { useMultipleOfferDetails, useOfferDetail } from "./useOfferDetail";

jest.mock("../../utils/offer/getOffer");
const getStoredOfferMock = jest.requireMock(
  "../../utils/offer/getOffer",
).getOffer;

const getOfferDetailsMock = jest.spyOn(
  peachAPI.private.offer,
  "getOfferDetails",
);
jest.useFakeTimers();

describe("useOfferDetail", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches offer detail from API", async () => {
    const { result } = renderHook(useOfferDetail, {
      initialProps: sellOffer.id,
    });

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offer: sellOffer,
      isLoading: false,
      isFetching: false,
      error: null,
    });
  });
  it("returns error if server did not return result", async () => {
    getStoredOfferMock.mockReturnValueOnce(undefined);
    getOfferDetailsMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useOfferDetail, {
      initialProps: sellOffer.id,
    });

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: false,
      isFetching: false,
      error: new Error("UNAUTHORIZED"),
    });
  });
  it("returns correct error if server did not return result or error", async () => {
    const expectedError = new Error("NOT_FOUND");
    getStoredOfferMock.mockReturnValueOnce(undefined);
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils);
    const { result } = renderHook(useOfferDetail, {
      initialProps: sellOffer.id,
    });

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: true,
      isFetching: true,
      error: null,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offer: undefined,
      isLoading: false,
      isFetching: false,
      error: expectedError,
    });
  });
});

describe("useMultipleOfferDetails", () => {
  afterEach(() => {
    queryClient.clear();
  });
  it("fetches offers details from API", async () => {
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    });

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offers: [sellOffer],
      isLoading: false,
      isFetching: false,
      errors: [null],
    });
  });
  it("returns errors if server did not return result", async () => {
    getStoredOfferMock.mockReturnValueOnce(undefined);
    getOfferDetailsMock.mockResolvedValueOnce({
      error: { error: "UNAUTHORIZED" },
      ...responseUtils,
    });
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    });

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: false,
      isFetching: false,
      errors: [new Error("UNAUTHORIZED")],
    });
  });
  it("returns correct errors if server did not return result or error", async () => {
    const expectedError = new Error("NOT_FOUND");
    getStoredOfferMock.mockReturnValueOnce(undefined);
    getOfferDetailsMock.mockResolvedValueOnce(responseUtils);
    const { result } = renderHook(useMultipleOfferDetails, {
      initialProps: [sellOffer.id],
    });

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: true,
      isFetching: true,
      errors: [null],
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current).toEqual({
      offers: [undefined],
      isLoading: false,
      isFetching: false,
      errors: [expectedError],
    });
  });
});
