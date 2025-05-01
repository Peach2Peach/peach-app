import { TouchableOpacity, View } from "react-native";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { PeachyBackground } from "../PeachyBackground";
import { PeachText } from "../text/PeachText";
import { statusCardStyles } from "./statusCardStyles";

type Props = {
  onPress: () => void;
  color: keyof typeof statusCardStyles.bg;
  statusInfo?: JSX.Element;
  amountInfo?: JSX.Element;
  label?: JSX.Element;
  instantTrade?: boolean;
};

export function StatusCard({
  color,
  onPress,
  statusInfo,
  amountInfo,
  label,
  instantTrade,
}: Props) {
  const { isDarkMode } = useThemeStore();

  return (
    <TouchableOpacity
      style={[
        tw`overflow-hidden border rounded-xl`,
        isDarkMode ? tw`bg-card` : tw`bg-primary-background-light`,
        tw.style(statusCardStyles.border[color]),
      ]}
      onPress={onPress}
    >
      {instantTrade && (
        <View style={tw`overflow-hidden rounded-md`}>
          <PeachyBackground />
          <PeachText
            style={tw`text-center py-2px subtitle-2 text-primary-background-light`}
          >
            {i18n("offerPreferences.instantTrade")}
          </PeachText>
        </View>
      )}
      <View style={tw`flex-row items-center justify-between px-4 py-3`}>
        {statusInfo}
        {amountInfo}
      </View>
      {label}
    </TouchableOpacity>
  );
}
