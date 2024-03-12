import { Header } from "../../../components/Header";
import { useStackNavigation } from "../../../hooks/useStackNavigation";
import i18n from "../../../utils/i18n";
import { headerIcons } from "../../../utils/layout/headerIcons";

export const WalletHeaderLightning = () => {
  const navigation = useStackNavigation();
  return (
    <Header
      title={i18n("wallet.lightning.title")}
      icons={[
        {
          ...headerIcons.list,
          accessibilityHint: `${i18n("goTo")} ${i18n("wallet.transactionHistory")}`,
          onPress: () => navigation.navigate("transactionHistoryLightning"),
        },
      ]}
    />
  );
};
