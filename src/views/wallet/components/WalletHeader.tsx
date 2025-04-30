import { Header } from "../../../components/Header";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import i18n from "../../../utils/i18n";
import { headerIcons } from "../../../utils/layout/headerIcons";

export const WalletHeader = () => {
  const navigation = useStackNavigation();
  return (
    <Header
      title={i18n("wallet.title")}
      hideGoBackButton
      icons={[
        {
          ...headerIcons.search,
          accessibilityHint: `${i18n("goTo")} ${i18n("wallet.addressChecker")}`,
          onPress: () => navigation.navigateDeprecated("addressChecker"),
        },
        {
          ...headerIcons.list,
          accessibilityHint: `${i18n("goTo")} ${i18n("wallet.transactionHistory")}`,
          onPress: () => navigation.navigateDeprecated("transactionHistory"),
        },
      ]}
    />
  );
};
