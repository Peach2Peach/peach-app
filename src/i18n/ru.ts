import accessibility from './accessibility/ru.json'
import analytics from './analytics/ru.json'
import batching from './batching/ru.json'
import buy from './buy/ru.json'
import chat from './chat/ru.json'
import contract from './contract/ru.json'
import error from './error/ru.json'
import form from './form/ru.json'
import global from './global/ru.json'
import help from './help/ru.json'
import notification from './notification/ru.json'
import offer from './offer/ru.json'
import paymentMethod from './paymentMethod/ru.json'
import profile from './profile/ru.json'
import referral from './referral/ru.json'
import sell from './sell/ru.json'
import settings from './settings/ru.json'
import test from './test/ru.json'
import unassigned from './unassigned/ru.json'
import wallet from './wallet/ru.json'
import welcome from './welcome/ru.json'

const ru: Record<string, string> = {
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

export default ru
