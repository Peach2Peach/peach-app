import { Header } from "../../../components/Header";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import { headerIcons } from "../../../utils/layout/headerIcons";
import { useTranslate } from "@tolgee/react";

export const WalletHeader = () => {
  const navigation = useStackNavigation();
  const { t } = useTranslate("wallet");
  return (
    <Header
      title={t("wallet.title")}
      hideGoBackButton
      icons={[
        {
          ...headerIcons.search,
          accessibilityHint: `${t("goTo", { ns: "global" })} ${t("wallet.addressChecker")}`,
          onPress: () => navigation.navigate("addressChecker"),
        },
        {
          ...headerIcons.list,
          accessibilityHint: `${t("goTo", { ns: "global" })} ${t("wallet.transactionHistory")}`,
          onPress: () => navigation.navigate("transactionHistory"),
        },
      ]}
    />
  );
};
