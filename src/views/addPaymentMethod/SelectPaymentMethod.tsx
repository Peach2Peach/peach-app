import { useMemo, useState } from "react";

import tw from "../../styles/tailwind";
import i18n from "../../utils/i18n";

import { PeachScrollView } from "../../components/PeachScrollView";
import { Screen } from "../../components/Screen";
import { Button } from "../../components/buttons/Button";
import { DrawerOptionType } from "../../components/drawer/components/DrawerOption";
import { useDrawerState } from "../../components/drawer/useDrawerState";
import { RadioButtons } from "../../components/inputs/RadioButtons";
import { PaymentLogoType } from "../../components/payment/logos";
import { useRoute } from "../../hooks/useRoute";
import { useStackNavigation } from "../../hooks/useStackNavigation";
import { PAYMENTCATEGORIES } from "../../paymentMethods";
import { getApplicablePaymentCategories } from "../../utils/paymentMethod/getApplicablePaymentCategories";
import { paymentMethodAllowedForCurrency } from "../../utils/paymentMethod/paymentMethodAllowedForCurrency";
import { usePaymentMethodLabel } from "./hooks";
import { getCurrencyTypeFilter } from "./utils";

const NATIONALOPTIONS = {
  EUR: {
    IT: ["satispay", "postePay"],
    PT: ["mbWay"],
    ES: ["bizum"],
    FI: ["mobilePay"],
    HR: ["keksPay"],
    FR: ["paylib", "lydia", "satispay"],
    DE: ["satispay"],
    GR: ["iris"],
    RU: ["sberbank", "tinkoff"],
  },
  LATAM: {
    BR: ["pix"],
    CO: ["daviPlata"],
    HN: ["tigoMoneyHonduras"],
    BO: ["tigoMoneyBolivia"],
    SV: ["tigoMoneyElSalvador"],
    PY: ["tigoMoneyParaguay"],
    GT: ["tigoMoneyGuatemala"],
  },
  AFRICA: {
    TZ: ["tigoPesa"],
  },
  ASIA: {
    IN: ["UPI", "paytm"],
    SG: ["payLah"],
  },
  OCEANIA: {
    AU: ["payID", "osko"],
  },
} as const;

const NATIONALOPTIONCOUNTRIES = {
  EUR: ["IT", "PT", "ES", "FI", "HR", "FR", "DE", "GR", "RU"],
  LATAM: ["CO", "SV"],
  AFRICA: ["TZ"],
  ASIA: ["IN", "SG"],
  OCEANIA: ["AU"],
  NORTHAMERICA: ["CAD"],
} as const;
type EuropeanCountry = keyof typeof NATIONALOPTIONS.EUR;
type LatAmCountry = keyof typeof NATIONALOPTIONS.LATAM;
type AfricaCountry = keyof typeof NATIONALOPTIONS.AFRICA;
type AsiaCountry = keyof typeof NATIONALOPTIONS.ASIA;
type OceaniaCountry = keyof typeof NATIONALOPTIONS.OCEANIA;
type NationalOptionsCountry =
  | EuropeanCountry
  | LatAmCountry
  | AfricaCountry
  | AsiaCountry
  | OceaniaCountry;

const isEuropeanCountry = (
  country: NationalOptionsCountry,
): country is EuropeanCountry => country in NATIONALOPTIONS.EUR;

const isLatAmCountry = (
  country: NationalOptionsCountry,
): country is LatAmCountry => country in NATIONALOPTIONS.LATAM;

const isAfricaCountry = (
  country: NationalOptionsCountry,
): country is AfricaCountry => country in NATIONALOPTIONS.AFRICA;

const isAsiaCountry = (
  country: NationalOptionsCountry,
): country is AsiaCountry => country in NATIONALOPTIONS.ASIA;

const mapCountryToDrawerOption =
  (onPress: (country: NationalOptionsCountry) => void) =>
  (country: NationalOptionsCountry) => ({
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
  const paymentCategories = useMemo(
    () =>
      getApplicablePaymentCategories(selectedCurrency).map((c) => ({
        value: c,
        display: i18n(`paymentCategory.${c}`),
      })),
    [selectedCurrency],
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

  const mapMethodToDrawerOption = (
    method: PaymentLogoType & PaymentMethod,
  ): DrawerOptionType => ({
    title: i18n(`paymentMethod.${method}`),
    logoID: method,
    onPress: () => selectPaymentMethod(method),
  });

  const getDrawerConfig = (category: PaymentCategory) => ({
    title: i18n(`paymentCategory.${category}`),
    show: true,
    onClose: unselectCategory,
  });

  const getNationalOptions = (country: NationalOptionsCountry) => {
    if (isEuropeanCountry(country)) return NATIONALOPTIONS.EUR[country];
    if (isLatAmCountry(country)) return NATIONALOPTIONS.LATAM[country];
    if (isAfricaCountry(country)) return NATIONALOPTIONS.AFRICA[country];
    if (isAsiaCountry(country)) return NATIONALOPTIONS.ASIA[country];
    return NATIONALOPTIONS.OCEANIA[country];
  };

  const getNationalOptionCountries = () => {
    if (getCurrencyTypeFilter("europe")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.EUR;
    }
    if (getCurrencyTypeFilter("latinAmerica")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.LATAM;
    }
    if (getCurrencyTypeFilter("africa")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.AFRICA;
    }
    if (getCurrencyTypeFilter("asia")(selectedCurrency)) {
      return NATIONALOPTIONCOUNTRIES.ASIA;
    }
    return NATIONALOPTIONCOUNTRIES.OCEANIA;
  };

  const selectCountry = (
    country:
      | keyof typeof NATIONALOPTIONS.EUR
      | keyof typeof NATIONALOPTIONS.LATAM
      | keyof typeof NATIONALOPTIONS.AFRICA
      | keyof typeof NATIONALOPTIONS.ASIA
      | keyof typeof NATIONALOPTIONS.OCEANIA,
    category: PaymentCategory,
  ) => {
    const nationalOptions = getNationalOptions(country);
    const nationalOptionCountries = getNationalOptionCountries();
    updateDrawer({
      title: i18n(`country.${country}`),
      options: nationalOptions.map(mapMethodToDrawerOption),
      previousDrawer: {
        options: nationalOptionCountries.map(
          mapCountryToDrawerOption((cntry) => selectCountry(cntry, category)),
        ),
        ...getDrawerConfig(category),
      },
      show: true,
      onClose: unselectCategory,
    });
  };

  const getDrawerOptions = (category: PaymentCategory) =>
    category === "nationalOption"
      ? getNationalOptionCountries().map(
          mapCountryToDrawerOption((country) =>
            selectCountry(country, category),
          ),
        )
      : PAYMENTCATEGORIES[category]
          .filter((method) =>
            paymentMethodAllowedForCurrency(method, selectedCurrency),
          )
          .filter(
            (method): method is PaymentMethod & PaymentLogoType =>
              category !== "giftCard" || method === "giftCard.amazon",
          )
          .map(mapMethodToDrawerOption);

  const showDrawer = (category: PaymentCategory) => {
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
