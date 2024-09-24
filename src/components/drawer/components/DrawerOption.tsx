import { TouchableOpacity, View } from "react-native";
import { IconType } from "../../../assets/icons";
import tw from "../../../styles/tailwind";
import { Flag } from "../../Flag";
import { Icon } from "../../Icon";
import { FlagType } from "../../flags";
import { PaymentLogo } from "../../payment/PaymentLogo";
import { PaymentLogoType } from "../../payment/logos";
import { FixedHeightText } from "../../text/FixedHeightText";
import { PeachText } from "../../text/PeachText";

const flagSubtextHeight = 17;
const defaultSubtextHeight = 22;

export type DrawerOptionType = {
  title: string;
  subtext?: string;
  iconRightID?: IconType;
  onPress: () => void;
} & (
  | {
      logoID: PaymentLogoType;
      flagID?: never;
      highlighted?: never;
      subtext?: never;
    }
  | {
      flagID: FlagType;
      logoID?: never;
      highlighted?: never;
    }
  | {
      flagID?: never;
      logoID?: never;
      highlighted: boolean;
      subtext: string;
      iconRightID?: never;
    }
  | {
      flagID?: never;
      logoID?: never;
      highlighted?: never;
    }
);

export const DrawerOption = ({
  logoID,
  flagID,
  title,
  subtext,
  iconRightID,
  highlighted,
  onPress,
}: DrawerOptionType) => (
  <TouchableOpacity
    style={[
      tw`flex-row items-center gap-3 px-8`,
      flagID
        ? subtext
          ? tw`py-2px`
          : tw`py-8px`
        : logoID
          ? tw`py-4px`
          : !subtext && (iconRightID ? tw`py-4px` : tw`py-6px`),
    ]}
    onPress={onPress}
  >
    {logoID && (
      <View
        style={tw`items-center justify-center w-8 h-8 border border-black-5 bg-primary-background-light rounded-5px`}
      >
        <PaymentLogo id={logoID} style={tw`w-6 h-6`} />
      </View>
    )}
    {flagID && <Flag id={flagID} style={tw`w-8 h-6`} />}

    <View style={[tw`justify-center grow`, flagID && tw`gap-2px`]}>
      {flagID || logoID || !subtext ? (
        <FixedHeightText
          height={flagID && subtext ? flagSubtextHeight : defaultSubtextHeight}
          style={tw`input-title`}
        >
          {title}
        </FixedHeightText>
      ) : (
        <PeachText
          style={[tw`input-title`, highlighted && tw`text-primary-main`]}
        >
          {title}
        </PeachText>
      )}

      {subtext &&
        (flagID ? (
          <FixedHeightText height={17} style={tw`body-s`}>
            {subtext}
          </FixedHeightText>
        ) : (
          <PeachText style={[tw`body-s`, highlighted && tw`text-primary-main`]}>
            {subtext}
          </PeachText>
        ))}
    </View>
    {(iconRightID || highlighted) && (
      <Icon
        id={iconRightID ? iconRightID : "star"}
        style={tw`w-6 h-6`}
        color={tw.color("primary-main")}
      />
    )}
  </TouchableOpacity>
);
