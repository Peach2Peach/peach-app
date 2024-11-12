import { useState } from "react";
import { View } from "react-native";
import { Screen } from "../../components/Screen";
import QRCode from "../../components/bitcoin/QRCode";
import { PeachText } from "../../components/text/PeachText";
import { CopyAble } from "../../components/ui/CopyAble";
import { HorizontalLine } from "../../components/ui/HorizontalLine";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import { useThemeStore } from "../../store/theme"; // Import theme store for dark mode check
import tw from "../../styles/tailwind";
import { getBitcoinAddressParts } from "../../utils/bitcoin/getBitcoinAddressParts";
import i18n from "../../utils/i18n";
import { BitcoinLoading } from "../loading/BitcoinLoading";
import { AddressNavigation } from "./components";
import { useLastUnusedAddress, useWalletAddress } from "./hooks";

export const ReceiveBitcoin = () => {
  const { data: lastUnusedAddress } = useLastUnusedAddress();
  const [index, setIndex] = useState<number>();
  const displayIndex = index ?? lastUnusedAddress?.index ?? 0;
  const { isLoading } = useWalletAddress(displayIndex);

  if (isLoading) return <BitcoinLoading />;

  return (
    <Screen header={i18n("wallet.receiveBitcoin.title")}>
      <View style={[tw`items-center flex-1 gap-2 py-1`, tw`md:gap-8 md:py-6`]}>
        <AddressNavigation setIndex={setIndex} index={displayIndex} />

        <HorizontalLine />

        <View style={tw`items-center self-stretch justify-center gap-4`}>
          <AddressQRCode index={displayIndex} />
          <BitcoinAddress index={displayIndex} />
        </View>
      </View>
    </Screen>
  );
};

const MEDIUM_SIZE = 327;
const SMALL_SIZE = 275;
function AddressQRCode({ index }: { index: number }) {
  const { data } = useWalletAddress(index);
  const isMediumScreen = useIsMediumScreen();
  return (
    <>
      {!!data && (
        <QRCode
          value={data.address}
          size={isMediumScreen ? MEDIUM_SIZE : SMALL_SIZE}
        />
      )}
      {data?.used && (
        <PeachText
          style={[
            tw`text-center h3 text-error-main`,
            tw`absolute self-center p-1 overflow-hidden rounded-xl bg-opacity-65 top-110px bg-primary-background-light-color`,
            tw`md:top-135px md:bg-opacity-85`,
          ]}
        >
          {i18n("wallet.address.used")}
        </PeachText>
      )}
    </>
  );
}

function BitcoinAddress({ index }: { index: number }) {
  const { data } = useWalletAddress(index);
  const { isDarkMode } = useThemeStore(); // Access dark mode state
  const address = data?.address ?? "";
  const isUsed = data?.used ?? false;
  const addressParts = getBitcoinAddressParts(address);
  return (
    <View style={tw`flex-row items-center self-stretch gap-3 px-1`}>
      <PeachText
        style={tw`shrink ${isDarkMode ? "text-black-50" : "text-black-50"} body-l`}
      >
        {addressParts.one}
        <PeachText
          style={tw` ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"} body-l`}
        >
          {addressParts.two}
        </PeachText>
        {addressParts.three}
        <PeachText
          style={tw` ${isDarkMode ? "text-backgroundLight-light" : "text-black-100"} body-l`}
        >
          {addressParts.four}
        </PeachText>
      </PeachText>
      <CopyAble
        value={address}
        style={tw`w-6 h-6`}
        color={isUsed ? tw`text-primary-mild-1` : tw`text-primary-main`}
      />
    </View>
  );
}
