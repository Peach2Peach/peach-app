import { TouchableOpacity } from "react-native";
import { FillProps } from "react-native-svg";
import { IconType } from "../../assets/icons";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";
import { SummaryItem, SummaryItemProps } from "./SummaryItem";

type Props = SummaryItemProps & {
  text: string;
  iconId?: IconType;
  iconColor?: FillProps["fill"];
  onPress?: () => void;
};

export const TextSummaryItem = ({
  text,
  iconId,
  iconColor,
  onPress,
  ...props
}: Props) => (
  <SummaryItem {...props}>
    <TouchableOpacity
      style={tw`flex-row items-center justify-between gap-2`}
      onPress={onPress}
      disabled={!onPress}
    >
      <PeachText style={tw`subtitle-1`}>{text}</PeachText>
      {!!iconId && <Icon id={iconId} color={iconColor} size={16} />}
    </TouchableOpacity>
  </SummaryItem>
);
