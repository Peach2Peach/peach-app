import { LogoIcons } from "../../../assets/logo";
import { Header, HeaderProps } from "../../../components/Header";
import { PeachText } from "../../../components/text/PeachText";
import { useThemeStore } from "../../../store/theme";
import tw from "../../../styles/tailwind";
import i18n from "../../../utils/i18n";

export function SellBitcoinHeader(props: HeaderProps) {
  const { isDarkMode } = useThemeStore();

  return (
    <Header
      {...props}
      titleComponent={
        <>
          <PeachText style={tw`h7 md:h6 text-primary-main`}>
            {i18n("sell")}
          </PeachText>
          {isDarkMode ? (
            <LogoIcons.bitcoinTextDark
              style={tw`h-14px md:h-16px w-63px md:w-71px`}
            />
          ) : (
            <LogoIcons.bitcoinText
              style={tw`h-14px md:h-16px w-63px md:w-71px`}
            />
          )}
        </>
      }
    />
  );
}
