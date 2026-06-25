import { useMemo, useState } from "react";

import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

import { PaymentMethod } from "../../../peach-api/src/@types/payment";
import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { FlagType } from "../../components/flags";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { PAYMENTCATEGORIES } from "../../paymentMethods";
import { keys } from "../../utils/object/keys";
import { getCurrencyTypeFilter } from "./getCurrencyTypeFilter";
import { usePaymentMethodLabel } from "./hooks";
import { usePaymentMethods } from "./usePaymentMethodInfo";

const NATIONALOPTIONS: Record<
  "EUR" | "LATAM",
  Record<string, PaymentMethod[]>
> = {
  EUR: {
    BE: ["wero"],
    // LU: ["wero"],
    IT: ["satispay", "postePay", "hype"],
    PT: ["mbWay"],
    ES: ["bizum", "rebellion", "halcash"],
    FI: ["mobilePay"],
    HR: ["keksPay"],
    FR: ["wero", "lydia", "satispay"],
    DE: ["satispay", "wero"],
    GR: ["iris"],
    DK: ["mobilePay"],
    NL: ["wero"],
  },
  LATAM: {
    BR: ["pix"],
  },
};

const NATIONALOPTIONCOUNTRIES: Record<"EUR" | "LATAM", FlagType[]> = {
  EUR: ["IT", "PT", "ES", "FI", "HR", "FR", "DE", "GR", "DK", "NL"],
  LATAM: ["BR"],
};

const mapCountryToDrawerOption =
  (onPress: (country: FlagType) => void) => (country: FlagType) => ({
    title: i18n(`country.${country}`),
    flagID: country,
    onPress: () => onPress(country),
  });

export const SelectPaymentMethod = () => {
  const navigation = useStackNavigation();
  const { selectedCurrency, origin } = useRoute<"selectPaymentMethod">().params;
  const updateDrawer = useDrawerState((state) => state.updateDrawer);

  const [selectedPaymentCategory, setSelectedPaymentCategory] =
    useState<PaymentCategory>();
  const { data: paymentMethodInfos } = usePaymentMethods();

  const paymentCategories = useMemo(
    () =>
      keys(PAYMENTCATEGORIES)
        .filter(
          (category) =>
            PAYMENTCATEGORIES[category]?.filter((paymentMethod) =>
              paymentMethodInfos
                ?.find(({ id }) => id === paymentMethod)
                ?.currencies.includes(selectedCurrency),
            ).length > 0 && category !== "cash",
        )
        .map((c) => ({
          value: c,
          display: i18n(`paymentCategory.${c}`),
        })),
    [paymentMethodInfos, selectedCurrency],
  );

  const getPaymentMethodLabel = usePaymentMethodLabel();

  const goToPaymentMethodForm = (paymentMethod: PaymentMethod) => {
    const label = getPaymentMethodLabel(paymentMethod);
    navigation.navigate("paymentMethodForm", {
      paymentData: {
        type: paymentMethod,
        label,
        currencies: [selectedCurrency],
      },
      origin,
    });
  };

  const unselectCategory = () => setSelectedPaymentCategory(undefined);

  const selectPaymentMethod = (paymentMethod: PaymentMethod) => {
    unselectCategory();
    updateDrawer({ show: false });

    if (paymentMethod === "giftCard.amazon") {
      navigation.navigate("selectCountry", { selectedCurrency, origin });
    } else {
      goToPaymentMethodForm(paymentMethod);
    }
  };

  const mapMethodToDrawerOption = (method: PaymentMethod) => ({
    title: i18n(`paymentMethod.${method}`),
    logoID: method,
    onPress: () => selectPaymentMethod(method),
  });

  const getDrawerConfig = (category: PaymentCategory) => ({
    title: i18n(`paymentCategory.${category}`),
    show: true,
    onClose: unselectCategory,
  });

  const getNationalOptions = () => {
    if (getCurrencyTypeFilter("europe")(selectedCurrency)) {
      return NATIONALOPTIONS.EUR;
    }
    return NATIONALOPTIONS.LATAM;
  };

  const getNationalOptionCountries = () => {
    if (getCurrencyTypeFilter("europe")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.EUR;
    }
    return NATIONALOPTIONCOUNTRIES.LATAM;
  };

  // Flattened, alphabetically sorted list of every national payment method
  // available for the selected currency's region (deduplicated across countries).
  const getNationalOptionMethods = () => {
    const uniqueMethods = [
      ...new Set(Object.values(getNationalOptions()).flat()),
    ];
    return uniqueMethods
      .map(mapMethodToDrawerOption)
      .sort((a, b) => a.title.localeCompare(b.title));
  };

  const selectCountry = (country: FlagType, previousDrawer: DrawerState) => {
    const nationalOptions = getNationalOptions()[country];
    updateDrawer({
      title: i18n(`country.${country}`),
      options: nationalOptions.map(mapMethodToDrawerOption),
      previousDrawer,
      show: true,
      onClose: unselectCategory,
    });
  };

  // Optional "browse by country" flow: pick a country first, then its methods.
  // Currently hidden (see getNationalOptionsDrawer) but kept available — the
  // underscore prefix marks it as intentionally unused for now.
  const _getCountriesDrawer = (
    category: PaymentCategory,
    previousDrawer: DrawerState,
  ): DrawerState => {
    const countriesDrawer: DrawerState = {
      options: getNationalOptionCountries().map(
        mapCountryToDrawerOption((country) =>
          selectCountry(country, countriesDrawer),
        ),
      ),
      previousDrawer,
      ...getDrawerConfig(category),
    };
    return countriesDrawer;
  };

  // Default flow: show every national method alphabetically.
  // The country-based browsing (_getCountriesDrawer) is kept available but
  // hidden — re-add a "browse by country" entry here to expose it again:
  //   {
  //     title: i18n("paymentCategory.nationalOption.byCountry"),
  //     iconRightID: "chevronRight",
  //     onPress: () =>
  //       updateDrawer(_getCountriesDrawer(category, nationalOptionsDrawer)),
  //   }
  const getNationalOptionsDrawer = (category: PaymentCategory): DrawerState => {
    const nationalOptionsDrawer: DrawerState = {
      options: getNationalOptionMethods(),
      ...getDrawerConfig(category),
    };
    return nationalOptionsDrawer;
  };

  const { data: paymentMethods } = usePaymentMethods();

  const getDrawerOptions = (category: PaymentCategory) =>
    PAYMENTCATEGORIES[category]
      .filter((method) =>
        paymentMethods
          ?.find((pm) => pm.id === method)
          ?.currencies.includes(selectedCurrency),
      )
      .filter(
        (method) =>
          category !== "giftCard" ||
          method === "giftCard.amazon" ||
          method === "giftCard.steam",
      )
      .map(mapMethodToDrawerOption);

  const showDrawer = (category: PaymentCategory) => {
    if (category === "nationalOption") {
      updateDrawer(getNationalOptionsDrawer(category));
      return;
    }
    updateDrawer({
      options: getDrawerOptions(category),
      ...getDrawerConfig(category),
    });
  };

  const selectPaymentCategory = (category: PaymentCategory) => {
    setSelectedPaymentCategory(category);
    showDrawer(category);
  };

  return (
    <Screen header={i18n("selectPaymentMethod.title")}>
      <PeachScrollView
        contentContainerStyle={[tw`justify-center py-4 grow`, tw`md:py-8`]}
      >
        <RadioButtons
          items={paymentCategories}
          selectedValue={selectedPaymentCategory}
          onButtonPress={selectPaymentCategory}
        />
      </PeachScrollView>
      <Button style={tw`self-center`} disabled={!selectedPaymentCategory}>
        {i18n("next")}
      </Button>
    </Screen>
  );
};
