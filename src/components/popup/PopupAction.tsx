import { useTranslate } from "@tolgee/react";
import { TextStyle, TouchableOpacity } from "react-native";
import { IconType } from "../../assets/icons";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { PeachText } from "../text/PeachText";

export type PopupActionProps = ComponentProps & {
  onPress: (() => void) | (() => Promise<void>) | undefined;
  label: string | undefined;
  iconId: IconType;
  reverseOrder?: boolean;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
};
export const PopupAction = ({
  onPress,
  label,
  iconId,
  reverseOrder,
  style,
  textStyle,
  loading,
  disabled,
}: PopupActionProps) => {
  const { t } = useTranslate();

  return (
    <TouchableOpacity
      style={[
        tw`flex-row items-center gap-1 px-6 py-2 grow`,
        disabled && tw`opacity-50`,
        reverseOrder && tw`flex-row-reverse`,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <Loading size="small" color={tw.color("primary-background-light")} />
      ) : (
        <Icon
          id={iconId}
          color={textStyle?.color ?? tw.color("primary-background-light")}
          size={16}
        />
      )}
      <PeachText
        style={[tw`subtitle-1 text-primary-background-light`, textStyle]}
      >
        {loading ? t("loading") : label}
      </PeachText>
    </TouchableOpacity>
  );
};
