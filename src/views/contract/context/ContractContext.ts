import { createContext } from "react";
import { Contract } from "../../../../peach-api/src/@types/contract";

type ContractContextType = {
  contract: Contract;
  paymentData?: PaymentData;
  isDecryptionError: boolean;
  view: "buyer" | "seller";
  showBatchInfo: boolean;
  toggleShowBatchInfo: () => void;
  isFirstTradeAsBuyer?: boolean;
};

export const ContractContext = createContext<ContractContextType | undefined>(
  undefined,
);
