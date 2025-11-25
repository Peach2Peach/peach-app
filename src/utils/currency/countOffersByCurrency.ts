import { shallow } from "zustand/shallow";
import { BuyOffer69 } from "../../../peach-api/src/@types/offer";
import { useOfferPreferences } from "../../store/offerPreferenes";
import { useSettingsStore } from "../../store/settingsStore/useSettingsStore";
import { usePaymentDataStore } from "../../store/usePaymentDataStore";
import { isDefined } from "../validation/isDefined";

export type CountsByCurrency = Partial<Record<Currency, number>>;

export function countOffersByCurrency(
  offers: (BuyOffer69 | SellOffer)[],
): CountsByCurrency {
  const counts: CountsByCurrency = {};

  for (const offer of offers) {
    for (const currency of Object.keys(offer.meansOfPayment) as Currency[]) {
      counts[currency] = (counts[currency] ?? 0) + 1;
    }
  }

  return counts;
}

function getMostRelevantCurrency(
  result: Partial<Record<Currency, number>>,
  currencies: Currency[],
): Currency | undefined {
  let best: Currency | undefined;
  let bestCount = -Infinity;

  for (const currency of currencies) {
    const count = result[currency] ?? 0;

    if (count > bestCount) {
      best = currency;
      bestCount = count;
    }
  }

  return best;
}

function filterCurrencyCounted(
  currencyCounted: Partial<Record<Currency, number>>,
  interestingCurrencies: Currency[],
): Partial<Record<Currency, number>> {
  const filtered: Partial<Record<Currency, number>> = {};

  let foundAny = false;

  for (const currency of interestingCurrencies) {
    if (currency in currencyCounted) {
      filtered[currency] = currencyCounted[currency];
      foundAny = true;
    }
  }

  return foundAny ? filtered : currencyCounted;
}

export function getBestCurrency(
  currencyCounted: CountsByCurrency,
  offer: BuyOffer69 | SellOffer,
  selectedCurrencies: Currency[],
): Currency | undefined {
  const defaultCurrency = useSettingsStore((state) => state.displayCurrency);

  const paymentData = usePaymentDataStore(
    (state) => Object.values(state.paymentData),
    shallow,
  );

  const [preferredPaymentMethods, toggle] = useOfferPreferences(
    (state) => [state.preferredPaymentMethods, state.togglePaymentMethod],
    shallow,
  );
  const selectedPaymentDataIds = Object.values(preferredPaymentMethods).filter(
    isDefined,
  );

  const filteredPaymentData = paymentData.filter((x) =>
    selectedPaymentDataIds.includes(x.id),
  );

  const set = new Set<Currency>();

  for (const item of filteredPaymentData) {
    for (const currency of item.currencies) {
      set.add(currency);
    }
  }

  const interestingCurrenciesTemp = Array.from(set);

  const interestingCurrencies = selectedCurrencies
    ? interestingCurrenciesTemp.filter((x) => selectedCurrencies.includes(x))
    : interestingCurrenciesTemp;

  const finalCurrencyCounted = filterCurrencyCounted(
    currencyCounted,
    interestingCurrencies,
  );

  const bestCurrency = Object.keys(offer.meansOfPayment).includes(
    defaultCurrency,
  )
    ? defaultCurrency
    : getMostRelevantCurrency(
        finalCurrencyCounted,
        Object.keys(offer.meansOfPayment) as Currency[],
      );

  return bestCurrency;
}
