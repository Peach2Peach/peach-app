import { createContext } from "react";

type ContractContextType = {
  contract: Contract;
  paymentData?: PaymentData;
  buyerPaymentData?: PaymentData;
  isDecryptionError: boolean;
  view: ContractViewer;
  showBatchInfo: boolean;
  toggleShowBatchInfo: () => void;
};

export const ContractContext = createContext<ContractContextType | undefined>(
  undefined,
);
