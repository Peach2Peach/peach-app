import accessibility from "./accessibility/en.json";
import analytics from "./analytics/en.json";
import batching from "./batching/en.json";
import buy from "./buy/en.json";
import chat from "./chat/en.json";
import contract from "./contract/en.json";
import error from "./error/en.json";
import form from "./form/en.json";
import global from "./global/en.json";
import help from "./help/en.json";
import home from "./home/en.json";
import match from "./match/en.json";
import notification from "./notification/en.json";
import offer from "./offer/en.json";
import offerPreferences from "./offerPreferences/en.json";
import paymentMethod from "./paymentMethod/en.json";
import profile from "./profile/en.json";
import referral from "./referral/en.json";
import sell from "./sell/en.json";
import settings from "./settings/en.json";
import unassigned from "./unassigned/en.json";
import wallet from "./wallet/en.json";
import welcome from "./welcome/en.json";

const en: Record<string, string> = {
  ...global,
  ...accessibility,
  ...analytics,
  ...batching,
  ...buy,
  ...chat,
  ...contract,
  ...error,
  ...form,
  ...help,
  ...offerPreferences,
  ...home,
  ...match,
  ...notification,
  ...offer,
  ...paymentMethod,
  ...profile,
  ...referral,
  ...sell,
  ...settings,
  ...unassigned,
  ...wallet,
  ...welcome,
};

export default en;
