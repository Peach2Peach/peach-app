import i18n from "../i18n";

type TimeLeft = {
  totalMilliseconds: number;
  days: number;
  hours: number;
  minutes: number;
  isPast: boolean;
};

function getTimeLeft(targetTimestamp: number | Date): TimeLeft {
  const now = new Date().getTime();
  const target =
    targetTimestamp instanceof Date
      ? targetTimestamp.getTime()
      : targetTimestamp;

  const diff = target - now;

  const isPast = diff < 0;
  const absoluteDiff = Math.abs(diff);

  const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (absoluteDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((absoluteDiff % (1000 * 60 * 60)) / (1000 * 60));

  return {
    totalMilliseconds: diff,
    days,
    hours,
    minutes,
    isPast,
  };
}
type ExpiryStrings = {
  // Days + Hours
  daysAndHours: string;
  dayAndHours: string;
  daysAndHour: string;
  dayAndHour: string;

  // Hours + Minutes
  hoursAndMinutes: string;
  hourAndMinutes: string;
  hoursAndMinute: string;
  hourAndMinute: string;

  // Minutes only
  minutesOnly: string;
  minuteOnly: string;
};

function format(template: string, ...values: (string | number)[]) {
  return template.replace(/{(\d+)}/g, (_, i) =>
    values[i] !== undefined ? String(values[i]) : "",
  );
}

export function getExpiryString(
  expiryTimestamp: number | undefined,
  type: "buy" | "sell",
): string | undefined {
  const sellOfferStrings: ExpiryStrings = {
    // Days + Hours
    daysAndHours: i18n("sellOffer.expiry.daysAndHours"),
    dayAndHours: i18n("sellOffer.expiry.dayAndHours"),
    daysAndHour: i18n("sellOffer.expiry.daysAndHour"),
    dayAndHour: i18n("sellOffer.expiry.dayAndHour"),

    // Hours + Minutes
    hoursAndMinutes: i18n("sellOffer.expiry.hoursAndMinutes"),
    hourAndMinutes: i18n("sellOffer.expiry.hourAndMinutes"),
    hoursAndMinute: i18n("sellOffer.expiry.hoursAndMinute"),
    hourAndMinute: i18n("sellOffer.expiry.hourAndMinute"),

    // Minutes only
    minutesOnly: i18n("sellOffer.expiry.minutes"),
    minuteOnly: i18n("sellOffer.expiry.minute"),
  };

  const buyOfferStrings: ExpiryStrings = {
    // Days + Hours
    daysAndHours: i18n("buyOffer.expiry.daysAndHours"),
    dayAndHours: i18n("buyOffer.expiry.dayAndHours"),
    daysAndHour: i18n("buyOffer.expiry.daysAndHour"),
    dayAndHour: i18n("buyOffer.expiry.dayAndHour"),

    // Hours + Minutes
    hoursAndMinutes: i18n("buyOffer.expiry.hoursAndMinutes"),
    hourAndMinutes: i18n("buyOffer.expiry.hourAndMinutes"),
    hoursAndMinute: i18n("buyOffer.expiry.hoursAndMinute"),
    hourAndMinute: i18n("buyOffer.expiry.hourAndMinute"),

    // Minutes only
    minutesOnly: i18n("buyOffer.expiry.minutes"),
    minuteOnly: i18n("buyOffer.expiry.minute"),
  };

  if (
    typeof expiryTimestamp !== "number" ||
    !Number.isFinite(expiryTimestamp)
  ) {
    return undefined;
  }

  const defaultStrings = type === "buy" ? buyOfferStrings : sellOfferStrings;

  const timeLeft = getTimeLeft(expiryTimestamp);
  if (timeLeft.isPast) return undefined;

  const { days, hours, minutes } = timeLeft;

  // ---- Days + Hours ----
  if (days > 0) {
    if (days === 1 && hours === 1) {
      return format(defaultStrings.dayAndHour, days, hours);
    }
    if (days === 1) {
      return format(defaultStrings.dayAndHours, days, hours);
    }
    if (hours === 1) {
      return format(defaultStrings.daysAndHour, days, hours);
    }
    return format(defaultStrings.daysAndHours, days, hours);
  }

  // ---- Hours + Minutes ----
  if (hours > 0) {
    if (hours === 1 && minutes === 1) {
      return format(defaultStrings.hourAndMinute, hours, minutes);
    }
    if (hours === 1) {
      return format(defaultStrings.hourAndMinutes, hours, minutes);
    }
    if (minutes === 1) {
      return format(defaultStrings.hoursAndMinute, hours, minutes);
    }
    return format(defaultStrings.hoursAndMinutes, hours, minutes);
  }

  // ---- Minutes Only ----
  if (minutes === 1) {
    return format(defaultStrings.minuteOnly, minutes);
  }

  return format(defaultStrings.minutesOnly, minutes);
}
