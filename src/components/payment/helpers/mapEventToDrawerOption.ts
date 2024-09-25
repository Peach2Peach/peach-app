import { BitcoinEvent } from "../../../../peach-api/src/@types/events";

export const mapEventToDrawerOption =
  (onPress: (eventID: BitcoinEvent["id"]) => void) =>
  ({ longName, city, featured, id }: BitcoinEvent) => ({
    title: longName,
    subtext: city,
    highlighted: featured,
    onPress: () => onPress(id),
  });
