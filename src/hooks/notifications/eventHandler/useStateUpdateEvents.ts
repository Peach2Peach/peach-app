import { useMemo } from "react";
import { shallow } from "zustand/shallow";
import { useTradeSummaryStore } from "../../../store/tradeSummaryStore";

type PNEventHandlers = Partial<
  Record<NotificationType, (data: PNData) => void>
>;

export const useStateUpdateEvents = () => {
  const [getContractSummary, setContract] = useTradeSummaryStore(
    (state) => [state.getContract, state.setContract],
    shallow,
  );
  const stateUpdateEvents: PNEventHandlers = useMemo(
    () => ({
      // PN-A03
      "contract.chat": ({ contractId }: PNData) => {
        if (!contractId) return;
        const contract = getContractSummary(contractId);
        if (!contract) return;
        setContract(contractId, {
          unreadMessages: contract.unreadMessages + 1,
        });
      },
    }),
    [getContractSummary, setContract],
  );
  return stateUpdateEvents;
};
