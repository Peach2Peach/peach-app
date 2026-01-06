import { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { IconType } from "../../assets/icons";
import { useIsMediumScreen } from "../../hooks/useIsMediumScreen";
import tw from "../../styles/tailwind";
import { Icon } from "../Icon";
import { Loading } from "../Loading";
import { PeachText } from "../text/PeachText";

export type ButtonProps = {
  iconId?: IconType;
  ghost?: boolean;
  textColor?: string;
  children: ReactNode;
  loading?: boolean;
  numberOfLines?: number;
  fullSpace?: boolean;
  noBorder?: boolean;
} & TouchableOpacityProps;

const MEDIUM_ICON_SIZE = 18;
const SMALL_ICON_SIZE = 14;

export const Button = ({
  iconId,
  ghost,
  textColor = tw.color("backgroundMain-light"),
  children,
  loading,
  numberOfLines,
  fullSpace = true,
  noBorder = false,
  ...touchableOpacityProps
}: ButtonProps) => {
  const isMediumScreen = useIsMediumScreen();

  return (
    <TouchableOpacity
      {...touchableOpacityProps}
      disabled={touchableOpacityProps.disabled || loading}
      style={[
        tw`bg-primary-main`,
        fullSpace && tw`min-w-26 `,
        fullSpace && tw`md:min-w-32`,
        tw`flex-row items-center justify-center gap-2  rounded-full py-3px`,
        fullSpace && tw`px-6 md:py-2 md:px-8`,
        touchableOpacityProps.disabled && tw`opacity-33`,
        ghost && tw`bg-transparent`,
        ghost && !noBorder && tw`border-2`,
        { borderColor: ghost ? textColor : undefined },
        touchableOpacityProps.style,
      ]}
    >
      <PeachText
        numberOfLines={numberOfLines || 1}
        ellipsizeMode="tail"
        style={[
          tw`button-small`,
          tw`md:button-medium`,
          { color: textColor, textAlign: "center" },
        ]}
      >
        {children}
      </PeachText>

      {loading ? (
        <Loading size={"small"} color={textColor} />
      ) : (
        !!iconId && (
          <Icon
            id={iconId}
            size={isMediumScreen ? MEDIUM_ICON_SIZE : SMALL_ICON_SIZE}
            color={textColor}
          />
        )
      )}
    </TouchableOpacity>
  );
};
