import { shallow } from "zustand/shallow";
import { useRefreshPaymentDataFromServerOnMount } from "../../hooks/query/peach069/useRefreshPaymentDataFromServerOnMount";
import { useUploadRefundAddressToServer } from "../../hooks/query/peach069/useUploadRefundAddressToServer";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { CustomAddressScreen } from "./CustomAddressScreen";

export const RefundAddress = () => {
  useRefreshPaymentDataFromServerOnMount();
  const navigation = useStackNavigation();

  const [
    refundAddress,
    setRefundAddress,
    refundAddressLabel,
    setRefundAddressLabel,
    setRefundToPeachWallet,
  ] = useSettingsStore(
    (state) => [
      state.refundAddress,
      state.setRefundAddress,
      state.refundAddressLabel,
      state.setRefundAddressLabel,
      state.setRefundToPeachWallet,
    ],
    shallow,
  );
  const uploadRefundAddressToServer = useUploadRefundAddressToServer();

  const onSave = (address: string, addressLabel: string) => {
    setRefundAddress(address);
    setRefundAddressLabel(addressLabel);
    setRefundToPeachWallet(false);
    uploadRefundAddressToServer();
    navigation.goBack();
  };

  return (
    <CustomAddressScreen
      key={`${refundAddress ?? ""}::${refundAddressLabel ?? ""}`}
      defaultAddressLabel={refundAddressLabel}
      defaultAddress={refundAddress}
      onSave={onSave}
      showRemoveWallet
    />
  );
};
