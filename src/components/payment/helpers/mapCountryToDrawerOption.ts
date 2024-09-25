import { BitcoinEvent } from "../../../../peach-api/src/@types/events";
import i18n from "../../../utils/i18n";
import { DrawerOptionType } from "../../drawer/components/DrawerOption";
import { FlagType } from "../../flags";

export const mapCountryToDrawerOption =
  (
    onPress: (
      eventsByCountry: Record<BitcoinEvent["country"], BitcoinEvent[]>,
      selected: BitcoinEvent["country"],
    ) => void,
    eventsByCountry: Record<BitcoinEvent["country"], BitcoinEvent[]>,
  ) =>
  (country: FlagType & BitcoinEvent["country"]): DrawerOptionType => ({
    title: i18n(`country.${country}`),
    flagID: country,
    onPress: () => onPress(eventsByCountry, country),
  });
