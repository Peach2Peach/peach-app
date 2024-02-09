import accessibility from "./accessibility/el-GR.json";
import analytics from "./analytics/el-GR.json";
import batching from "./batching/el-GR.json";
import buy from "./buy/el-GR.json";
import chat from "./chat/el-GR.json";
import contract from "./contract/el-GR.json";
import error from "./error/el-GR.json";
import form from "./form/el-GR.json";
import global from "./global/el-GR.json";
import help from "./help/el-GR.json";
import home from "./home/el-GR.json";
import match from "./match/el-GR.json";
import notification from "./notification/el-GR.json";
import offer from "./offer/el-GR.json";
import offerPreferences from "./offerPreferences/el-GR.json";
import paymentMethod from "./paymentMethod/el-GR.json";
import profile from "./profile/el-GR.json";
import referral from "./referral/el-GR.json";
import sell from "./sell/el-GR.json";
import settings from "./settings/el-GR.json";
import test from "./test/el-GR.json";
import unassigned from "./unassigned/el-GR.json";
import wallet from "./wallet/el-GR.json";
import welcome from "./welcome/el-GR.json";

const el: Record<string, string> = {
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

export default el;
