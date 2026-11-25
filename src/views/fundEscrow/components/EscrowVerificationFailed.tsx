import { View } from "react-native";
import { Icon } from "../../../components/Icon";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

/**
 * shown instead of anything escrow related (address, QR code, funding buttons)
 * when the escrow the server gave us is not the one derived from our own key
 */
export function EscrowVerificationFailed() {
  return (
    <View style={tw`items-center justify-center gap-4 grow px-4`}>
      <Icon id="alertTriangle" size={48} color={tw.color("error-main")} />
      <PeachText style={tw`text-center h5 text-error-main`}>
        {i18n("ESCROW_ADDRESS_MISMATCH.title")}
      </PeachText>
      <PeachText style={tw`text-center body-l`}>
        {i18n("ESCROW_ADDRESS_MISMATCH.text")}
      </PeachText>
    </View>
  );
}
