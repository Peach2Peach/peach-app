import { Contract } from "../../../peach-api/src/@types/contract";

export const getRequiredAction = (contract: Contract) => {
  const { canceled, tradeStatus, paymentMade, paymentConfirmed } = contract;
  if (canceled || ["fundEscrow", "fundingExpired"].includes(tradeStatus))
    return "none";

  if (!paymentMade) {
    return "sendPayment";
  } else if (!paymentConfirmed) {
    return "confirmPayment";
  }
  return "none";
};
