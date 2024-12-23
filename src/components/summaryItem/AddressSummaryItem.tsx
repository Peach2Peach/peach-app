import { View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { ShortBitcoinAddress } from "../bitcoin/ShortBitcoinAddress";
import { PeachText } from "../text/PeachText";
import { CopyAble } from "../ui/CopyAble";
import { SummaryItem, SummaryItemProps } from "./SummaryItem";

type Props = SummaryItemProps & {
  address?: string;
};

export const AddressSummaryItem = ({ address, ...props }: Props) => {
  const { isDarkMode } = useThemeStore();

  const addressTextStyle = isDarkMode
    ? tw`text-backgroundLight-light`
    : tw`text-black-100`;

  return (
    <SummaryItem {...props}>
      <View style={tw`flex-row items-center gap-2`}>
        {address ? (
          <ShortBitcoinAddress
            style={[tw`subtitle-1`, addressTextStyle]}
            address={address}
          />
        ) : (
          <PeachText style={[tw`subtitle-1`, addressTextStyle]}>
            {i18n("loading")}
          </PeachText>
        )}
        <CopyAble value={address} />
      </View>
    </SummaryItem>
  );
};
