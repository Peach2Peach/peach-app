import accessibility from './accessibility/fr.json'
import analytics from './analytics/fr.json'
import batching from './batching/fr.json'
import buy from './buy/fr.json'
import chat from './chat/fr.json'
import contract from './contract/fr.json'
import error from './error/fr.json'
import form from './form/fr.json'
import global from './global/fr.json'
import help from './help/fr.json'
import home from './home/fr.json'

import notification from './notification/fr.json'
import offer from './offer/fr.json'
import paymentMethod from './paymentMethod/fr.json'
import profile from './profile/fr.json'
import referral from './referral/fr.json'
import sell from './sell/fr.json'
import settings from './settings/fr.json'
import test from './test/fr.json'
import unassigned from './unassigned/fr.json'
import wallet from './wallet/fr.json'
import welcome from './welcome/fr.json'

const fr: Record<string, string> = {
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
}

export default fr
