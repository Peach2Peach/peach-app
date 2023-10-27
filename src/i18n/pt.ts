import accessibility from './accessibility/pt.json'
import analytics from './analytics/pt.json'
import batching from './batching/pt.json'
import buy from './buy/pt.json'
import chat from './chat/pt.json'
import contract from './contract/pt.json'
import error from './error/pt.json'
import form from './form/pt.json'
import global from './global/pt.json'
import help from './help/pt.json'
import notification from './notification/pt.json'
import offer from './offer/pt.json'
import paymentMethod from './paymentMethod/pt.json'
import profile from './profile/pt.json'
import referral from './referral/pt.json'
import sell from './sell/pt.json'
import settings from './settings/pt.json'
import test from './test/pt.json'
import unassigned from './unassigned/pt.json'
import wallet from './wallet/pt.json'
import welcome from './welcome/pt.json'

const pt: Record<string, string> = {
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

export default pt
