import { useContext } from "react";
import { ContractContext } from "./ContractContext";

export const useContractContext = () => {
  const context = useContext(ContractContext);
  if (!context)
    throw new Error(
      "useContractContext must be used within a ContractContextProvider",
    );
  return context;
};
