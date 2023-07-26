import accessibility from './accessibility/es.json'
import analytics from './analytics/es.json'
import buy from './buy/es.json'
import chat from './chat/es.json'
import contract from './contract/es.json'
import error from './error/es.json'
import form from './form/es.json'
import global from './global/es.json'
import help from './help/es.json'
import notification from './notification/es.json'
import offer from './offer/es.json'
import paymentMethod from './paymentMethod/es.json'
import profile from './profile/es.json'
import referral from './referral/es.json'
import sell from './sell/es.json'
import settings from './settings/es.json'
import test from './test/es.json'
import unassigned from './unassigned/es.json'
import wallet from './wallet/es.json'
import welcome from './welcome/es.json'

const es: Record<string, string> = {
  ...global,
  ...accessibility,
  ...analytics,
  ...buy,
  ...chat,
  ...contract,
  ...error,
  ...form,
  ...help,
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

export default es