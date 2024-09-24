import { Contract } from "../../../../peach-api/src/@types/contract";
import { isPaymentTooLate } from "../../../utils/contract/status/isPaymentTooLate";

export const shouldShowTradeStatusInfo = (
  contract: Pick<
    Contract,
    | "paymentMade"
    | "paymentExpectedBy"
    | "canceled"
    | "cancelationRequested"
    | "disputeWinner"
    | "tradeStatus"
  >,
  view: "buyer" | "seller",
