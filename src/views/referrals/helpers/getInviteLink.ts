import { languageState } from "../../../utils/i18n";
import { getLocalizedLink } from "../../../utils/web/getLocalizedLink";

export const getInviteLink = (code: string) =>
  getLocalizedLink(`referral?code=${code}`, languageState.locale);
