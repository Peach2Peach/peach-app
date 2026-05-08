import { NETWORK } from "@env";
import { Platform } from "react-native";
import DeviceInfo, {
  getBuildNumber,
  getUniqueIdSync,
  getVersion,
} from "react-native-device-info";
import { getGenericPassword, setGenericPassword } from "react-native-keychain";
import { IconType } from "./assets/icons";
import tw from "./styles/tailwind";
import { sha256 } from "./utils/crypto/sha256";

export const MAXIMUM_CHF_AMOUNT_OF_OFFER = 950;
export const MINIMUM_CHF_AMOUNT_OF_OFFER = 1;

export const PIN_CODE_MAX_SIZE = 8;

export const THOUSANDS_GROUP = 3;
export const CENT = 100;
export const SATSINBTC = 100000000;
export const TOTAL_BITCOIN = 21000000;
export const TOTAL_SATS = TOTAL_BITCOIN * SATSINBTC;
export const MSINASECOND = 1000;
const SECONDS_IN_A_MINUTE = 60;
export const MSINAMINUTE = MSINASECOND * SECONDS_IN_A_MINUTE;
const MINUTES_IN_AN_HOUR = 60;
export const MSINANHOUR = MSINAMINUTE * MINUTES_IN_AN_HOUR;
const HOURS_IN_A_DAY = 24;
export const MSINADAY = MSINANHOUR * HOURS_IN_A_DAY;
const DAYS_IN_A_MONTH = 30;
export const MSINAMONTH = DAYS_IN_A_MONTH * MSINADAY;
const FIFTEEN = 15;
export const FIFTEEN_SECONDS = FIFTEEN * MSINASECOND;
const TEN = 15;
export const TEN_SECONDS = TEN * MSINASECOND;
const FIVE = 5;
export const FIVE_SECONDS = FIVE * MSINASECOND;

export const NEW_USER_TRADE_THRESHOLD = 3;

export const APPVERSION = getVersion();
export const BUILDNUMBER = getBuildNumber();

export let CLIENTSERVERTIMEDIFFERENCE = 0;
export const setClientServerTimeDifference = (diff: number) =>
  (CLIENTSERVERTIMEDIFFERENCE = diff);

export const SESSION_ID = sha256(Math.random().toString());

export let UNIQUEID: string | undefined;

const SHARED_UNIQUE_ID_KEY =
  NETWORK === "bitcoin"
    ? "com.peachbitcoin.uniquePeachDeviceId"
    : "com.peachbitcoin.uniquePeachDeviceId-regtest";
const SHARED_KEYCHAIN_ACCESS_GROUP = "6G5FFY3H35.com.peachbitcoin.peach-shared";

export async function initUniqueId() {
  const freshUniqueId = sha256(getUniqueIdSync());
  if (Platform.OS !== "ios") {
    UNIQUEID = freshUniqueId;
    return;
  }
  const existing = await getGenericPassword({
    service: SHARED_UNIQUE_ID_KEY,
    accessGroup: SHARED_KEYCHAIN_ACCESS_GROUP,
  });
  if (existing) {
    UNIQUEID = existing.password;
    return;
  }

  await setGenericPassword(SHARED_UNIQUE_ID_KEY, freshUniqueId, {
    service: SHARED_UNIQUE_ID_KEY,
    accessGroup: SHARED_KEYCHAIN_ACCESS_GROUP,
  });
  UNIQUEID = freshUniqueId;
}
export const BUNDLEID = DeviceInfo.getBundleId();
export const TWITTER = "https://twitter.com/peachbitcoin";
export const INSTAGRAM = "https://www.instagram.com/peachbitcoin";
export const TELEGRAM = "https://t.me/+4roSpFA6jnk2M2M8";
export const DISCORD = "https://discord.gg/ypeHz3SW54";
export const TWITCH = "https://www.twitch.tv/peachbitcoin";
export const NOSTR =
  "https://snort.social/p/npub15369wu3wzzar5fclhecyqfv683x69n6nhlg7rxqnsg2dydgxflpq3apswl";
export const YOUTUBE = "https://www.youtube.com/@peachbitcoin";

export const badgeIconMap: Record<Medal, IconType> = {
  superTrader: "star",
  fastTrader: "zap",
  ambassador: "award",
};

export const fullScreenTabNavigationScreenOptions = {
  tabBarStyle: [tw`bg-transparent mx-sm`, tw`md:mx-md`],
  tabBarContentContainerStyle: tw`bg-transparent`,
  tabBarIndicatorStyle: tw`bg-primary-main`,
  tabBarItemStyle: tw`p-0`,
  tabBarPressColor: "transparent",
  tabBarLabelStyle: tw`lowercase input-title`,
};
