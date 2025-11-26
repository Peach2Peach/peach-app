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

  const [preferredPaymentMethods, _toggle] = useOfferPreferences(
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

  // we get the currencies that are on the payment methods of the user of the App
  // those are currencies the user is likely interested in
  const interestingCurrenciesTemp = Array.from(set);

  // we check if the user has any Currency filters
  // if yes, we consider the intersection of those 2 groups as the only interesting currencies for the user
  const interestingCurrencies = selectedCurrencies
    ? interestingCurrenciesTemp.filter((x) => selectedCurrencies.includes(x))
    : interestingCurrenciesTemp;

  // we have the list of most popular currencies (key pair: Currency-numberOfOffers)
  // we remove the currencies from the list of popularity if they are not interesting to the user
  // in case the interesting list is empty, we dont modify the popularity list
  const finalCurrencyCounted = filterCurrencyCounted(
    currencyCounted,
    interestingCurrencies.length > 0
      ? interestingCurrencies
      : selectedCurrencies,
  );

  // in case the Default Currency of the user (defined in the Settings page) is present
  // in the popularity list AND the specific offer list, we chose it
  // else, we chose the most popular

  const bestCurrency =
    Object.keys(finalCurrencyCounted).includes(defaultCurrency) &&
    Object.keys(offer.meansOfPayment).includes(defaultCurrency)
      ? defaultCurrency
      : getMostRelevantCurrency(
          finalCurrencyCounted,
          Object.keys(offer.meansOfPayment) as Currency[],
        );

  return bestCurrency;
}
