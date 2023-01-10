import i18n from '../i18n'

export const getMessages = () => ({
  required: i18n('form.required.error'),
  number: i18n('form.invalid.error'),
  phone: i18n('form.invalid.error'),
  email: i18n('form.email.error'),
  account: i18n('form.account.error'),
  password: i18n('form.password.error'),
  referralCode: i18n('form.invalid.error'),
  bitcoinAddress: i18n('form.address.btc.error'),
  tetherAddress: i18n('form.address.error'),
  duplicate: i18n('form.duplicate.error'),
  iban: i18n('form.iban.error'),
  bic: i18n('form.bic.error'),
  ukSortCode: i18n('form.invalid.error'),
  ukBankAccount: i18n('form.invalid.error'),
  userName: i18n('form.invalid.error'),
  revtag: i18n('form.invalid.error'),
  url: i18n('form.invalid.error'),
  bip39: i18n('form.bip39.error'),
  bip39Word: i18n('form.bip39Word.error'),
  feeRate: i18n('form.feeRate.error'),
})
