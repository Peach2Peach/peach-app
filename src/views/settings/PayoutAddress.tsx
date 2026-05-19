import { shallow } from "zustand/shallow";
import { useRefreshPaymentDataFromServerOnMount } from "../../hooks/query/peach069/useRefreshPaymentDataFromServerOnMount";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { CustomAddressScreen } from "./CustomAddressScreen";

export const PayoutAddress = () => {
  useRefreshPaymentDataFromServerOnMount();
  const navigation = useStackNavigation();

  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    (state) => [state.payoutAddress, state.payoutAddressLabel],
    shallow,
  );

  const onSave = (newAddress: string, newAddressLabel: string) => {
    navigation.replace("signMessage", {
      address: newAddress,
      addressLabel: newAddressLabel,
    });
  };

  return (
    <CustomAddressScreen
      key={`${payoutAddress ?? ""}::${payoutAddressLabel ?? ""}`}
      defaultAddress={payoutAddress}
      defaultAddressLabel={payoutAddressLabel}
      onSave={onSave}
      isPayout
      showRemoveWallet
    />
  );
};
