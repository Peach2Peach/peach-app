import { useState } from "react";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";
import { CurrencyTabs } from "./CurrencyTabs";
import { usePaymentMethodLabel } from "./hooks";

const USDTOPTIONS: {
  logoID: string;
  paymentMethodId: PaymentMethod;
  title: string;
}[] = [
  {
    logoID: "liquid",
    paymentMethodId: "liquid",
    title: "Liquid",
  },
  {
    logoID: "rootstock",
    paymentMethodId: "rootstockusdt",
    title: "Rootstock",
  },
  {
    logoID: "tron",
    paymentMethodId: "tronusdt",
    title: "TRON",
  },
  {
    logoID: "ethereum",
    paymentMethodId: "ethereumusdt",
    title: "Ethereum",
  },
  {
    logoID: "arbitrum",
    paymentMethodId: "arbitrumusdt",
    title: "Arbitrum",
  },
  {
    logoID: "base",
    paymentMethodId: "baseusdt",
    title: "Base",
  },
  {
    logoID: "bnb",
    paymentMethodId: "bnbusdt",
    title: "BNB",
  },
  {
    logoID: "solana",
    paymentMethodId: "solanausdt",
    title: "Solana",
  },
];

export const SelectCurrency = () => {
  const navigation = useStackNavigation();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("EUR");

  const { origin } = useRoute<"selectCurrency">().params;

  const getPaymentMethodLabel = usePaymentMethodLabel();

  const goToPaymentMethodForm = (type: PaymentMethod) => {
    const label = getPaymentMethodLabel(type);
    navigation.navigate("paymentMethodForm", {
      paymentData: { type, label, currencies: [selectedCurrency] },
      origin,
    });
  };

  //add drawer
  //////////
  //////////
  //////////

  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const showDrawer = () => {
    updateDrawer({
      show: true,
      title: i18n("USDT network"),
      options: USDTOPTIONS.map((x) => ({
        ...x,
        onPress: () => {
          goToPaymentMethodForm(x.paymentMethodId);
          updateDrawer({ show: false });
        },
      })),

      onClose: () => {},
    });
  };

  const selectPaymentCategory = () => {
    showDrawer();
  };

  //////////
  //////////
  //////////

  const next = () => {
    // if (selectedCurrency === "USDT") return goToPaymentMethodForm("liquid");
    if (selectedCurrency === "USDT") return selectPaymentCategory();
    if (selectedCurrency === "DOC")
      return goToPaymentMethodForm("dollaronchain");
    if (selectedCurrency === "SAT") return goToPaymentMethodForm("lnurl");
    return navigation.navigate("selectPaymentMethod", {
      selectedCurrency,
      origin,
    });
  };

  return (
    <Screen style={tw`px-0`} header={i18n("selectCurrency.title")}>
      <CurrencyTabs
        currency={selectedCurrency}
        setCurrency={setSelectedCurrency}
      />
      <Button style={tw`self-center`} onPress={next}>
        {i18n("next")}
      </Button>
    </Screen>
  );
};
