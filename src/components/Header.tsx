import { Fragment, ReactElement } from "react";
import {
  ColorValue,
  ScrollView,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Style } from "twrnc";
import { shallow } from "zustand/shallow";
import { Currency } from "../../peach-api/src/@types/global";
import { IconType } from "../assets/icons";
import { useBitcoinPrices } from "../hooks/useBitcoinPrices";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { useToggleBoolean } from "../hooks/useToggleBoolean";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";
import { uniqueArray } from "../utils/array/uniqueArray";
import i18n from "../utils/i18n";
import { getHeaderStyles } from "../utils/layout/getHeaderStyles";
import { thousands } from "../utils/string/thousands";
import { usePaymentMethods } from "../views/addPaymentMethod/usePaymentMethodInfo";
import { Icon } from "./Icon";
import { TouchableIcon } from "./TouchableIcon";
import { BTCAmount } from "./bitcoin/BTCAmount";
import { PeachText } from "./text/PeachText";
import { PriceFormat } from "./text/PriceFormat";

export type HeaderIcon = {
  id: IconType;
  accessibilityHint?: string;
  color?: ColorValue | undefined;
  onPress: () => void;
};

type HeaderConfig = {
  subtitle?: ReactElement;
  icons?: (ReactElement | HeaderIcon)[];
  hideGoBackButton?: boolean;
  theme?: "default" | "inverted";
  showPriceStats?: boolean;
  style?: ViewProps["style"];
} & (
  | {
      title?: string;
      titleComponent?: never;
    }
  | {
      title?: never;
      titleComponent: ReactElement;
    }
);

const getCommonStyles = (isDarkMode: boolean) => ({
  title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
  backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
});

const getBackground = (isDarkMode: boolean, lightModeColor: Style) =>
  isDarkMode ? tw`bg-backgroundMain-dark` : lightModeColor;

const newThemes = (isDarkMode: boolean) => ({
  buyer: {
    bg: getBackground(isDarkMode, tw`bg-success-background-dark-color`),
    ...getCommonStyles(isDarkMode),
    subtitle: isDarkMode ? tw`text-success-mild-2` : tw`text-success-main`,
    border: tw`border-b-8 border-success-mild-2`,
  },
  seller: {
    bg: getBackground(isDarkMode, tw`bg-primary-background-dark-color`),
    ...getCommonStyles(isDarkMode),
    subtitle: isDarkMode ? tw`text-primary-mild-2` : tw`text-primary-main`,
    border: tw`border-b-8 border-primary-mild-2`,
  },
  paymentTooLate: {
    bg: getBackground(isDarkMode, tw`bg-warning-mild-1`),
    ...getCommonStyles(isDarkMode),
    subtitle: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    border: tw`border-b-8 border-warning-mild-2`,
  },
  dispute: {
    bg: getBackground(isDarkMode, tw`bg-error-mild`),
    ...getCommonStyles(isDarkMode),
    subtitle: tw`text-error-main`,
    border: tw`border-b-8 border-error-dark`,
  },
  cancel: {
    bg: isDarkMode ? tw`bg-card` : tw`bg-black-10`,
    ...getCommonStyles(isDarkMode),
    subtitle: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    border: tw`border-b-8 border-black-25`,
  },
  default: {
    bg: getBackground(isDarkMode, tw`bg-backgroundMain-light`),
    ...getCommonStyles(isDarkMode),
    subtitle: isDarkMode ? tw`text-black-25` : tw`text-black-100`,
    border: tw`border-b border-primary-background-dark-color`,
  },
  transparent: {
    bg: tw`bg-transparent`,
    title: isDarkMode
      ? tw`text-backgroundLight-light`
      : tw`text-backgroundLight-light`,
    subtitle: tw`text-primary-background-light-color`,
    border: tw`border-transparent`,
    backButtonColor: tw.color("primary-background-light-color"),
  },
});

export type HeaderProps = Omit<HeaderConfig, "theme" | "style"> & {
  theme?: keyof ReturnType<typeof newThemes>;
};

export const Header = ({ showPriceStats, subtitle, ...props }: HeaderProps) => {
  const { top } = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();
  const themes = newThemes(isDarkMode);

  return (
    <View
      style={[
        tw`border-b rounded-b-lg`,
        { paddingTop: top, zIndex: 1 },
        themes[props.theme || "default"].bg,
        themes[props.theme || "default"].border,
      ]}
    >
      {showPriceStats && <Tickers />}
      {(props.title || props.titleComponent) && (
        <HeaderNavigation isDarkMode={isDarkMode} {...props} />
      )}
      {!!subtitle && subtitle}
    </View>
  );
};

function HeaderNavigation({
  title,
  icons,
  titleComponent,
  hideGoBackButton,
  theme = "default",
  isDarkMode,
}: Omit<HeaderConfig, "theme" | "style"> & {
  theme?: keyof ReturnType<typeof newThemes>;
  isDarkMode: boolean;
}) {
  const { goBack, canGoBack } = useStackNavigation();
  const { fontSize } = getHeaderStyles();
  const themes = newThemes(isDarkMode);
  const shouldShowBackButton = !hideGoBackButton && canGoBack();

  const titleStyle = isDarkMode
    ? tw`text-backgroundLight-light`
    : themes[theme].title;

  return (
    <View
      style={[
        tw`flex-row items-center gap-2 py-6px px-sm`,
        tw`md:px-md`,
        shouldShowBackButton && [tw`pl-0`, tw`md:pl-10px`],
      ]}
    >
      <View style={tw`flex-row items-center flex-1 gap-1`}>
        {shouldShowBackButton && (
          <TouchableOpacity onPress={goBack}>
            <Icon
              id="chevronLeft"
              style={24}
              color={themes[theme].backButtonColor}
            />
          </TouchableOpacity>
        )}
        {titleComponent || (
          <PeachText
            style={[...fontSize, titleStyle, tw`flex-1`]}
            numberOfLines={1}
          >
            {title}
          </PeachText>
        )}
      </View>

      <View style={tw`flex-row items-center justify-end gap-10px`}>
        {icons?.map((icon, i) => {
          if (typeof icon === "object" && "id" in icon && "onPress" in icon) {
            const { id, accessibilityHint, color, onPress } = icon;
            return (
              <TouchableIcon
                id={id}
                key={`${i}-${id}`}
                onPress={onPress}
                accessibilityHint={accessibilityHint}
                iconColor={
                  theme !== "dispute"
                    ? color
                    : tw.color("primary-background-light-color")
                }
                style={tw`w-5 h-5 md:w-6 md:h-6`}
              />
            );
          }
          return <Fragment key={i}>{icon}</Fragment>;
        })}
      </View>
    </View>
  );
}

const colStyle = [tw`flex-row flex-1 gap-2`, tw`md:flex-col md:gap-0`];
const leftColStyle = [...colStyle, tw`justify-start md:items-start`];
const rightColStyle = [...colStyle, tw`justify-end md:items-end`];
const unitStyle = tw`subtitle-1`;

type TickerProps = {
  type?: "buy" | "sell";
};

function Tickers({ type = "sell" }: TickerProps) {
  const { bitcoinPrice, moscowTime, displayCurrency } = useBitcoinPrices();
  const { isDarkMode } = useThemeStore();

  const labelStyle = isDarkMode
    ? tw`text-backgroundLight-light`
    : tw`text-black-100`;
  const valueStyle = [
    tw`leading-xl`,
    type === "sell" ? tw`text-primary-main` : tw`text-success-main`,
    tw`md:body-l`,
  ];

  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-1 px-sm`,
        tw`md:px-md md:py-2px`,
      ]}
    >
      <View style={leftColStyle}>
        <PeachText
          style={[unitStyle, labelStyle]}
        >{`1 ${i18n("btc")}`}</PeachText>
        <PriceFormat
          style={valueStyle}
          currency={displayCurrency}
          amount={bitcoinPrice}
          round
        />
      </View>
      <View style={rightColStyle}>
        <CurrencyScrollView />

        <PeachText
          style={[
            ...valueStyle,
            labelStyle,
            tw`text-right`,
            tw`text-primary-main`,
          ]}
        >
          {i18n("currency.format.sats", thousands(moscowTime))}
        </PeachText>
      </View>
    </View>
  );
}

function CurrencyScrollView() {
  const [showCurrencies, toggle] = useToggleBoolean();
  const [displayCurrency, setDisplayCurrency] = useSettingsStore(
    (state) => [state.displayCurrency, state.setDisplayCurrency],
    shallow,
  );
  const { isDarkMode } = useThemeStore();

  const currencyTextStyle = isDarkMode
    ? tw`text-primary-mild-1`
    : tw`text-black-100`;

  const { data: paymentMethods } = usePaymentMethods();
  const allCurrencies =
    paymentMethods
      ?.reduce((arr: Currency[], info) => arr.concat(info.currencies), [])
      .filter(uniqueArray) || [];

  return (
    <TouchableOpacity
      onPress={toggle}
      style={[tw`items-end flex-1 w-full grow`, { zIndex: 1 }]}
    >
      <ScrollView
        style={tw`absolute ${isDarkMode ? "bg-backgroundMain-dark" : "bg-backgroundMain-light"} max-h-40`}
        contentContainerStyle={[
          tw`items-end self-end justify-end`,
          showCurrencies
            ? tw.style(
                `pl-2 border`,
                isDarkMode ? "border-black-90" : "border-black-10",
                `rounded-lg`,
              )
            : { padding: 1 },
        ]}
        scrollEnabled={showCurrencies}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={tw`items-start`}
          onStartShouldSetResponder={() => showCurrencies}
        >
          <View style={tw`flex-row items-center gap-1`}>
            <PeachText
              style={[unitStyle, currencyTextStyle]}
            >{`1 ${displayCurrency}`}</PeachText>
            <TouchableIcon
              id={showCurrencies ? "chevronUp" : "chevronDown"}
              onPress={toggle}
              iconColor={tw.color(isDarkMode ? "primary-mild-1" : "black-100")}
            />
          </View>
          {showCurrencies &&
            allCurrencies
              .sort((a, b) => a.localeCompare(b))
              .filter((c) => c !== displayCurrency)
              .map((c) => (
                <PeachText
                  onPress={() => {
                    setDisplayCurrency(c);
                    toggle();
                  }}
                  key={c}
                  style={[unitStyle, currencyTextStyle]}
                >{`1 ${c}`}</PeachText>
              ))}
        </View>
      </ScrollView>
    </TouchableOpacity>
  );
}

type HeaderSubtitleProps = {
  theme?: keyof ReturnType<typeof newThemes>;
  amount: number;
  premium: number;
  viewer: "buyer" | "seller";
  text?: string;
};

function HeaderSubtitle({
  theme = "default",
  amount,
  premium,
  viewer,
  text,
}: HeaderSubtitleProps) {
  const { isDarkMode } = useThemeStore();
  const themes = newThemes(isDarkMode);

  return (
    <View
      style={[
        tw`flex-row items-center justify-between py-2px px-sm`,
        tw`md:px-md md:py-2`,
      ]}
    >
      <PeachText
        style={[tw`subtitle-1`, themes[theme].subtitle, tw`md:subtitle-0`]}
      >
        {text ??
          i18n(
            viewer === "buyer"
              ? "buy.subtitle.highlight"
              : "sell.subtitle.highlight",
          )}
      </PeachText>
      <BTCAmount
        amount={amount}
        style={tw`pb-2px`}
        white={theme === "dispute"}
        size="medium"
      />
      <PeachText style={[tw`subtitle-1 pt-3px`, themes[theme].subtitle]}>
        {premium > 0 ? "+" : ""}
        {String(premium)}%
      </PeachText>
    </View>
  );
}

Header.Subtitle = HeaderSubtitle;
