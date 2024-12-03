import { memo, useMemo } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { SATSINBTC } from "../../constants";
import { useThemeStore } from "../../store/theme";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { groupChars } from "../../utils/string/groupChars";
import { Icon } from "../Icon";
import { PeachText } from "../text/PeachText";

export type BTCAmountProps = {
  amount: number;
  size: "large" | "medium" | "small";
  showAmount?: boolean;
  white?: boolean;
  style?: StyleProp<ViewStyle>;
};

const styles = {
  small: {
    container: tw`w-130px h-10px`,
    iconContainer: tw`p-2px`,
    iconSize: 12,
    textContainer: tw`gap-2px`,
    amount: tw`-my-[10px] subtitle-2`,
    ellipseSize: 5,
  },
  medium: {
    container: tw`w-152px h-13px`,
    iconContainer: tw`p-[2.5px]`,
    iconSize: 15,
    textContainer: tw`gap-5px`,
    amount: tw`-my-[13px] subtitle-1`,
    ellipseSize: 6,
  },
  large: {
    container: tw`w-196px h-18px`,
    iconContainer: tw`p-1`,
    iconSize: 24,
    textContainer: tw`gap-5px`,
    amount: tw`subtitle-0`,
    ellipseSize: 8,
  },
};

export const BTCAmount = memo(
  ({
    amount,
    size,
    white = false,
    showAmount = true,
    style,
  }: BTCAmountProps) => {
    const [greyText, blackText] = useMemo(
      () => getDisplayAmount(amount),
      [amount],
    );
    const { isDarkMode } = useThemeStore();
    const textStyle = useMemo(
      () => [
        styles[size].amount,
        white
          ? tw`text-black-25`
          : isDarkMode
            ? tw`text-backgroundLight-light`
            : tw`text-black-100`,
      ],
      [isDarkMode, size, white],
    );
    return (
      <View
        style={[
          style,
          tw`flex-row items-center justify-between`,
          styles[size].container,
        ]}
      >
        <View style={[tw`shrink-0`, styles[size].iconContainer]}>
          <Icon
            id={white ? "bitcoinTransparent" : "bitcoinLogo"}
            size={styles[size].iconSize}
          />
        </View>

        <View
          style={[tw`flex-row items-center flex-1`, styles[size].textContainer]}
        >
          {!showAmount ? (
            <View
              style={tw`flex-row items-center justify-between flex-1 pl-1px`}
            >
              {[...Array(SATSINBTC.toString().length)].map((_, i) => (
                <Icon key={i} id="ellipse" size={styles[size].ellipseSize} />
              ))}
            </View>
          ) : (
            <View style={tw`flex-row items-center justify-end flex-1`}>
              <PeachText style={[tw`text-right opacity-10`, textStyle]}>
                {greyText}
              </PeachText>
              <PeachText style={[tw`text-right`, textStyle]}>
                {blackText}
              </PeachText>
            </View>
          )}
          <PeachText style={textStyle}>{i18n("currency.SATS")}</PeachText>
        </View>
      </View>
    );
  },
);

const GROUP_BY = 3;
export function getDisplayAmount(amount: number) {
  if (amount === 0) return ["0.00 000 00", "0"];

  const btc = amount / SATSINBTC;

  const [whole, decimal] = btc
    .toFixed(SATSINBTC.toString().length - 1)
    .split(".")
    .map((str) => groupChars(str, GROUP_BY));

  const displayAmount = `${whole}.${decimal}`;
  const firstValueIndex = displayAmount.search(/[^0. ]/u);
  const leadingZeros = displayAmount.substring(0, firstValueIndex);
  const restOfNumber = displayAmount.substring(firstValueIndex);

  if (leadingZeros.endsWith(" ")) {
    return [leadingZeros.slice(0, -1), ` ${restOfNumber}`];
  }

  return [leadingZeros, restOfNumber];
}
