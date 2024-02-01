import accessibility from "./accessibility/sw.json";
import analytics from "./analytics/sw.json";
import batching from "./batching/sw.json";
import buy from "./buy/sw.json";
import chat from "./chat/sw.json";
import contract from "./contract/sw.json";
import error from "./error/sw.json";
import form from "./form/sw.json";
import global from "./global/sw.json";
import help from "./help/sw.json";
import home from "./home/sw.json";
import match from "./match/sw.json";
import notification from "./notification/sw.json";
import offer from "./offer/sw.json";
import offerPreferences from "./offerPreferences/sw.json";
import paymentMethod from "./paymentMethod/sw.json";
import profile from "./profile/sw.json";
import referral from "./referral/sw.json";
import sell from "./sell/sw.json";
import settings from "./settings/sw.json";
import test from "./test/sw.json";
import unassigned from "./unassigned/sw.json";
import wallet from "./wallet/sw.json";
import welcome from "./welcome/sw.json";

const es: Record<string, string> = {
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
  ...test,
  ...unassigned,
  ...wallet,
  ...welcome,
};

export default es;
