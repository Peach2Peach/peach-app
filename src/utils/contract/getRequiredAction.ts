import { Contract } from "../../../peach-api/src/@types/contract";

export const getRequiredAction = (contract: Contract) => {

  if (!contract.paymentMade) {
    return "sendPayment";
  } else if (contract.paymentMade && !contract.paymentConfirmed) {
    return "confirmPayment";
  }
  return "none";
};
