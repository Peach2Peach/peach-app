import accessibility from "./accessibility/it.json";
import analytics from "./analytics/it.json";
import batching from "./batching/it.json";
import buy from "./buy/it.json";
import chat from "./chat/it.json";
import contract from "./contract/it.json";
import error from "./error/it.json";
import form from "./form/it.json";
import global from "./global/it.json";
import help from "./help/it.json";
import home from "./home/it.json";
import match from "./match/it.json";
import notification from "./notification/it.json";
import offer from "./offer/it.json";
import offerPreferences from "./offerPreferences/it.json";
import paymentMethod from "./paymentMethod/it.json";
import profile from "./profile/it.json";
import referral from "./referral/it.json";
import sell from "./sell/it.json";
import settings from "./settings/it.json";
import unassigned from "./unassigned/it.json";
import wallet from "./wallet/it.json";
import welcome from "./welcome/it.json";

const it: Record<string, string> = {
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

export default it;
