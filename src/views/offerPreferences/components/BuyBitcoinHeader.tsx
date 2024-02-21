import { LogoIcons } from "../../../assets/logo";
import { Header, HeaderProps } from "../../../components/Header";
import { PeachText } from "../../../components/text/PeachText";
import tw from "../../../styles/tailwind";
import { useTranslate } from "@tolgee/react";

export function BuyBitcoinHeader(props: HeaderProps) {
  const { t } = useTranslate("unassigned");
  return (
    <Header
      {...props}
      titleComponent={
        <>
          <PeachText style={tw`h7 md:h6 text-success-main`}>
            {t("buy")}
          </PeachText>
          <LogoIcons.bitcoinText
            style={tw`h-14px md:h-16px w-63px md:w-71px`}
          />
        </>
      }
    />
  );
}
