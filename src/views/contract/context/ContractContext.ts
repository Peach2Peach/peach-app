import { createContext } from "react";

type ContractContextType = {
  contract: Contract;
  paymentData?: PaymentData;
  buyerPaymentData?: PaymentData;
  isDecryptionError: boolean;
  /** the counterparty's payment details failed verification and are masked */
  hasSuspiciousPaymentData?: boolean;
  view: ContractViewer;
};

export const ContractContext = createContext<ContractContextType | undefined>(
  undefined,
);
