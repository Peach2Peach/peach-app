import accessibility from './accessibility/uk.json'
import analytics from './analytics/uk.json'
import batching from './batching/uk.json'
import buy from './buy/uk.json'
import chat from './chat/uk.json'
import contract from './contract/uk.json'
import error from './error/uk.json'
import form from './form/uk.json'
import global from './global/uk.json'
import help from './help/uk.json'
import home from './home/uk.json'
import match from './match/uk.json'
import notification from './notification/uk.json'
import offer from './offer/uk.json'
import offerPreferences from './offerPreferences/uk.json'
import paymentMethod from './paymentMethod/uk.json'
import profile from './profile/uk.json'
import referral from './referral/uk.json'
import sell from './sell/uk.json'
import settings from './settings/uk.json'
import test from './test/uk.json'
import unassigned from './unassigned/uk.json'
import wallet from './wallet/uk.json'
import welcome from './welcome/uk.json'

const uk: Record<string, string> = {
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
}

export default uk
