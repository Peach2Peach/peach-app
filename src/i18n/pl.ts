import accessibility from "./accessibility/pl.json";
import analytics from "./analytics/pl.json";
import batching from "./batching/pl.json";
import buy from "./buy/pl.json";
import chat from "./chat/pl.json";
import contract from "./contract/pl.json";
import error from "./error/pl.json";
import form from "./form/pl.json";
import global from "./global/pl.json";
import help from "./help/pl.json";
import home from "./home/pl.json";
import layer2 from "./layer2/pl.json";
import match from "./match/pl.json";
import notification from "./notification/pl.json";
import offer from "./offer/pl.json";
import offerPreferences from "./offerPreferences/pl.json";
import paymentMethod from "./paymentMethod/pl.json";
import profile from "./profile/pl.json";
import referral from "./referral/pl.json";
import sell from "./sell/pl.json";
import settings from "./settings/pl.json";
import test from "./test/pl.json";
import unassigned from "./unassigned/pl.json";
import wallet from "./wallet/pl.json";
import welcome from "./welcome/pl.json";

const pl: Record<string, string> = {
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
  ...layer2,
};

export default pl;
