import accessibility from "./accessibility/nl.json";
import analytics from "./analytics/nl.json";
import batching from "./batching/nl.json";
import buy from "./buy/nl.json";
import chat from "./chat/nl.json";
import contract from "./contract/nl.json";
import error from "./error/nl.json";
import form from "./form/nl.json";
import global from "./global/nl.json";
import help from "./help/nl.json";
import home from "./home/nl.json";
import layer2 from "./layer2/nl.json";
import notification from "./notification/nl.json";
import offer from "./offer/nl.json";
import paymentMethod from "./paymentMethod/nl.json";
import profile from "./profile/nl.json";
import referral from "./referral/nl.json";
import sell from "./sell/nl.json";
import settings from "./settings/nl.json";
import test from "./test/nl.json";
import unassigned from "./unassigned/nl.json";
import wallet from "./wallet/nl.json";
import welcome from "./welcome/nl.json";

const nl: Record<string, string> = {
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
  ...home,
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

export default nl;
