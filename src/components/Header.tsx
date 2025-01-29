import {
  ColorValue,
  ScrollView,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { shallow } from "zustand/shallow";
import { IconType } from "../assets/icons";
import { useBitcoinPrices } from "../hooks/useBitcoinPrices";
import { useStackNavigation } from "../hooks/useStackNavigation";
import { useToggleBoolean } from "../hooks/useToggleBoolean";
import { CURRENCIES } from "../paymentMethods";
import { useSettingsStore } from "../store/settingsStore/useSettingsStore";
import { useThemeStore } from "../store/theme";
import tw from "../styles/tailwind";
import i18n from "../utils/i18n";
import { getHeaderStyles } from "../utils/layout/getHeaderStyles";
import { thousands } from "../utils/string/thousands";
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
  subtitle?: JSX.Element;
  icons?: HeaderIcon[];
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
      titleComponent: JSX.Element;
    }
);

const newThemes = (isDarkMode: boolean) => ({
  buyer: {
    bg: isDarkMode
      ? tw`bg-backgroundMain-dark`
      : tw`bg-success-background-dark-color`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: isDarkMode ? tw`text-success-mild-2` : tw`text-success-main`,
    border: tw`border-b-8 border-success-mild-2`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
  },
  seller: {
    bg: isDarkMode
      ? tw`bg-backgroundMain-dark`
      : tw`bg-primary-background-dark-color`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: isDarkMode ? tw`text-primary-mild-2` : tw`text-primary-main`,
    border: tw`border-b-8 border-primary-mild-2`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
  },
  paymentTooLate: {
    bg: isDarkMode ? tw`bg-backgroundMain-dark` : tw`bg-warning-mild-1`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    border: tw`border-b-8 border-warning-mild-2`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
  },
  dispute: {
    bg: isDarkMode ? tw`bg-backgroundMain-dark` : tw`bg-error-mild`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: tw`text-error-main`,
    border: tw`border-b-8 border-error-dark`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
  },
  cancel: {
    bg: isDarkMode ? tw`bg-card` : tw`bg-black-10`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    border: tw`border-b-8 border-black-25`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
  },
  default: {
    bg: isDarkMode ? tw`bg-backgroundMain-dark` : tw`bg-backgroundMain-light`,
    title: isDarkMode ? tw`text-backgroundLight-light` : tw`text-black-100`,
    subtitle: isDarkMode ? tw`text-black-25` : tw`text-black-100`,
    border: tw`border-b border-primary-background-dark-color`,
    backButtonColor: isDarkMode ? tw.color("black-25") : tw.color("black-65"),
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
  const { iconSize, fontSize } = getHeaderStyles();
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
        {icons?.map(({ id, accessibilityHint, color, onPress }, i) => (
          <TouchableOpacity
            key={`${i}-${id}`}
            style={tw`p-2px`}
            {...{ accessibilityHint, onPress }}
          >
            <Icon
              id={id}
              color={
                theme !== "dispute"
                  ? color
                  : tw.color("primary-background-light-color")
              }
              style={iconSize}
            />
          </TouchableOpacity>
        ))}
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
            CURRENCIES.filter((c) => c !== displayCurrency).map((c) => (
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
