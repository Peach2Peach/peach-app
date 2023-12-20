import accessibility from './accessibility/tr.json'
import analytics from './analytics/tr.json'
import batching from './batching/tr.json'
import buy from './buy/tr.json'
import chat from './chat/tr.json'
import contract from './contract/tr.json'
import error from './error/tr.json'
import form from './form/tr.json'
import global from './global/tr.json'
import help from './help/tr.json'
import match from './match/tr.json'
import notification from './notification/tr.json'
import offer from './offer/tr.json'
import offerPreferences from './offerPreferences/tr.json'
import paymentMethod from './paymentMethod/tr.json'
import profile from './profile/tr.json'
import referral from './referral/tr.json'
import sell from './sell/tr.json'
import settings from './settings/tr.json'
import test from './test/tr.json'
import unassigned from './unassigned/tr.json'
import wallet from './wallet/tr.json'
import welcome from './welcome/tr.json'

const tr: Record<string, string> = {
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
}

export default tr
