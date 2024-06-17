// tolgee.d.ts

import type accessibility from "../i18n/accessibility/en.json";
import type analytics from "../i18n/analytics/en.json";
import type batching from "../i18n/batching/en.json";
import type buy from "../i18n/buy/en.json";
import type chat from "../i18n/chat/en.json";
import type contract from "../i18n/contract/en.json";
import type error from "../i18n/error/en.json";
import type form from "../i18n/form/en.json";
import type global from "../i18n/global/en.json";
import type help from "../i18n/help/en.json";
import type home from "../i18n/home/en.json";
import type match from "../i18n/match/en.json";
import type notification from "../i18n/notification/en.json";
import type offer from "../i18n/offer/en.json";
import type offerPreferences from "../i18n/offerPreferences/en.json";
import type paymentMethod from "../i18n/paymentMethod/en.json";
import type profile from "../i18n/profile/en.json";
import type referral from "../i18n/referral/en.json";
import type sell from "../i18n/sell/en.json";
import type settings from "../i18n/settings/en.json";
import type unassigned from "../i18n/unassigned/en.json";
import type wallet from "../i18n/wallet/en.json";
import type welcome from "../i18n/welcome/en.json";

declare module "@tolgee/core/lib/types" {
  type TranslationsType = typeof accessibility &
    typeof analytics &
    typeof batching &
    typeof buy &
    typeof chat &
    typeof contract &
    typeof error &
    typeof form &
    typeof global &
    typeof help &
    typeof home &
    typeof match &
    typeof notification &
    typeof offer &
    typeof offerPreferences &
    typeof paymentMethod &
    typeof profile &
    typeof referral &
    typeof sell &
    typeof settings &
    typeof unassigned &
    typeof wallet &
    typeof welcome;

  // ensures that nested keys are accessible with "."
  type DotNotationEntries<T> = T extends object
    ? {
        [K in keyof T]: `${K & string}${T[K] extends undefined
          ? ""
          : T[K] extends object
            ? `.${DotNotationEntries<T[K]>}`
            : ""}`;
      }[keyof T]
    : "";

  export type TranslationKey = DotNotationEntries<TranslationsType>;
}
