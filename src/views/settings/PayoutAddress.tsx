import { shallow } from "zustand/shallow";
import { useNavigation } from "../../hooks/useNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { CustomAddressScreen } from "./CustomAddressScreen";

export const PayoutAddress = () => {
  const navigation = useNavigation();

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
      defaultAddress={payoutAddress}
      defaultAddressLabel={payoutAddressLabel}
      onSave={onSave}
      isPayout
      showRemoveWallet
    />
  );
};
