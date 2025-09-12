import { useShallow } from "zustand/shallow";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { CustomAddressScreen } from "./CustomAddressScreen";

export const PayoutAddress = () => {
  const navigation = useStackNavigation();

  const [payoutAddress, payoutAddressLabel] = useSettingsStore(
    useShallow((state) => [state.payoutAddress, state.payoutAddressLabel]),
  );

  const onSave = (newAddress: string, newAddressLabel: string) => {
    navigation.replace("signMessage", {
      address: newAddress,
      addressLabel: newAddressLabel,
    });
  };

  return (
    <CustomAddressScreen
      defaultAddress={payoutAddress}
      defaultAddressLabel={payoutAddressLabel}
      onSave={onSave}
      isPayout
      showRemoveWallet
    />
  );
};
