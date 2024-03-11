import { nodeInfo } from "@breeztech/react-native-breez-sdk";
import { useQuery } from "@tanstack/react-query";
import { useSetOverlay } from "../../../Overlay";
import { useSettingsStore } from "../../../store/settingsStore/useSettingsStore";
import { floor } from "../../../utils/math/floor";
import { BackupTime } from "../../overlays/BackupTime";

export const MSAT_PER_SAT = 1000;

export const emptyLightningBalance = {
  lightningMsats: 0,
  lightning: 0,
  onchain: 0,
  total: 0,
};
export const useLightningWalletBalance = () => {
  const {
    data: balance,
    refetch,
    isRefetching,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet", "lightning", "balance"],
    queryFn: async () => {
      const nodeState = await nodeInfo();
      const lightning = floor(nodeState.channelsBalanceMsat / MSAT_PER_SAT);
      const onchain = floor(nodeState.onchainBalanceMsat / MSAT_PER_SAT);

      return {
        lightningMsats: nodeState.channelsBalanceMsat,
        lightning,
        onchain,
        total: lightning + onchain,
      };
    },
    initialData: emptyLightningBalance,
  });

  const [shouldShowBackupOverlay, showBackupReminder, setShowBackupReminder] =
    useSettingsStore((state) => [
      state.shouldShowBackupOverlay,
      state.showBackupReminder,
      state.setShowBackupReminder,
    ]);

  const setOverlay = useSetOverlay();
  if (!showBackupReminder && balance.total > 0 && shouldShowBackupOverlay) {
    setShowBackupReminder(true);
    setOverlay(
      <BackupTime
        navigationParams={[
          { name: "homeScreen", params: { screen: "wallet" } },
        ]}
      />,
    );
  }

  return { balance, refetch, isRefetching, isLoading, error };
};
