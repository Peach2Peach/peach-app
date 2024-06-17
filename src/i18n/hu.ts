import accessibility from "./accessibility/hu.json";
import analytics from "./analytics/hu.json";
import batching from "./batching/hu.json";
import buy from "./buy/hu.json";
import chat from "./chat/hu.json";
import contract from "./contract/hu.json";
import error from "./error/hu.json";
import form from "./form/hu.json";
import global from "./global/hu.json";
import help from "./help/hu.json";
import home from "./home/hu.json";
import notification from "./notification/hu.json";
import offer from "./offer/hu.json";
import paymentMethod from "./paymentMethod/hu.json";
import profile from "./profile/hu.json";
import referral from "./referral/hu.json";
import sell from "./sell/hu.json";
import settings from "./settings/hu.json";
import unassigned from "./unassigned/hu.json";
import wallet from "./wallet/hu.json";
import welcome from "./welcome/hu.json";

const hu: Record<string, string> = {
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
  ...unassigned,
  ...wallet,
  ...welcome,
};

export default hu;
