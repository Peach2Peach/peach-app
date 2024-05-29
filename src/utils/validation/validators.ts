import { PaymentMethodField } from "../../../peach-api/src/@types/payment";
import i18n from "../i18n";
import { getMessages } from "./getMessages";
import { isAdvcashWallet } from "./isAdvcashWallet";
import { isBIC } from "./isBIC";
import { isEUIBAN } from "./isEUIBAN";
import { isEmail } from "./isEmail";
import { isIBAN } from "./isIBAN";
import { isPhone } from "./isPhone";
import { isPhoneAllowed } from "./isPhoneAllowed";
import { isUKBankAccount } from "./isUKBankAccount";
import { isUKSortCode } from "./isUKSortCode";
import { isUsername } from "./isUsername";
import { isValidDigitLength } from "./isValidDigitLength";
import { isValidPaymentReference } from "./isValidPaymentReference";
import { isEDRPOU } from "./isEDRPOU";
import { isSteamFriendCode } from "./isSteamFriendCode";
import { isUPIId } from "./isUPIId";
import { isCPFValid } from "./isCPFValid";
import { isRUTValid } from "./isRUTValid";
import { isDniValid } from "./isDniValid";
import { isValidMobileNetwork } from "./isValidMobileNetwork";
import { isValidPayeerNumber } from "./isValidPayeerNumber";
import { isValidPerfectMoney } from "./isValidPerfectMoney";

const ibanValidator = (value: string) => isIBAN(value) || getMessages().iban;
const isEUIBANValidator = (value: string) =>
  isEUIBAN(value) || getMessages().isEUIBAN;
const bicValidator = (value: string) => isBIC(value) || getMessages().bic;
const referenceValidator = (value: string) =>
  isValidPaymentReference(value) || getMessages().isValidPaymentReference;
const advcashWalletValidator = (value: string) =>
  isAdvcashWallet(value) || getMessages().advcashWallet;
const emailValidator = (value: string) => isEmail(value) || getMessages().email;
const phoneValidator = (value: string) => isPhone(value) || getMessages().phone;
const ukBankAccountValidator = (value: string) =>
  isUKBankAccount(value) || getMessages().ukBankAccount;
const ukSortCodeValidator = (value: string) =>
  isUKSortCode(value) || getMessages().ukSortCode;
const userNameValidator = (value: string) =>
  isUsername(value) || getMessages().userName;
const isPhoneAllowedValidator = (value: string) =>
  isPhoneAllowed(value) || getMessages().isPhoneAllowed;
const minAccountNumberLength = 10;
const maxAccountNumberLength = 28;
const accountNumberValidator = (value: string) =>
  isValidDigitLength(value, [minAccountNumberLength, maxAccountNumberLength]) ||
  i18n("form.account.errors");
const edrpouValidator = (value: string) =>
  isEDRPOU(value) || getMessages().edrpou;
const steamValidator = (value: string) =>
  isSteamFriendCode(value) || getMessages().steam;
const upiValidator = (value: string) => isUPIId(value) || getMessages().upi;
const cpfValidator = (value: string) => isCPFValid(value) || getMessages().cpf;
const rutValidator = (value: string) => isRUTValid(value) || getMessages().rut;
const dniValidator = (value: string) => isDniValid(value) || getMessages().dni;
const mobileNetworkValidator = (value: string) =>
  isValidMobileNetwork(value) || getMessages().mobileNetwork;
const payeerNumberValidator = (value: string) =>
  isValidPayeerNumber(value) || getMessages().payeerNumber;
const perfectMoneyValidator = (value: string) =>
  isValidPerfectMoney(value) || getMessages().perfectMoney;

type NewRule = {
  [key: string]: (value: string) => true | string;
};

const validators: Record<PaymentMethodField, NewRule> = {
  beneficiary: {},
  iban: {
    iban: ibanValidator,
    isEUIBAN: isEUIBANValidator,
  },
  bic: {
    bic: bicValidator,
  },
  reference: {
    isValidPaymentReference: referenceValidator,
  },
  wallet: {
    advcashWallet: advcashWalletValidator,
  },
  email: {
    email: emailValidator,
  },
  phone: {
    phone: phoneValidator,
    isPhoneAllowed: isPhoneAllowedValidator,
  },
  pixAlias: {},
  postePayNumber: {},
  receiveAddress: {},
  ukBankAccount: {
    ukBankAccount: ukBankAccountValidator,
  },
  ukSortCode: {
    ukSortCode: ukSortCodeValidator,
  },
  userName: {
    userName: userNameValidator,
  },
  accountNumber: {
    accountNumber: accountNumberValidator,
  },
  lnurlAddress: {
    lnurlAddress: emailValidator,
  },
  edrpou: {
    edrpou: edrpouValidator,
  },
  clabe: {},
  bankName: {},
  steamFriendCode: {
    steam: steamValidator,
  },
  upiTag: {
    upi: upiValidator,
  },
  trSortCode: {},
  cardNumber: {},
  physicalAddress: {},
  mobileNetwork: {
    mobileNetwork: mobileNetworkValidator,
  },
  bankCode: {},
  brSortCode: {},
  cpf: {
    cpf: cpfValidator,
  },
  cedulaIdentidad: {},
  countryField: {},
  bankBranch: {},
  rutNumber: {
    rut: rutValidator,
  },
  dniNumber: {
    rut: dniValidator,
  },
  abitabAgent: {},
  payeerNumber: {
    payeerNumber: payeerNumberValidator,
  },
  perfectMoneyNumber: {
    payeerNumber: perfectMoneyValidator,
  },
};

export type PaymentFieldTypes = keyof typeof validators;

export const getValidators = (
  fieldName: PaymentFieldTypes,
  optional = false,
) => {
  const rulesForField = validators[fieldName];

  if (!optional) return rulesForField;

  const rulesWithEmptyCheck = Object.entries(rulesForField).reduce(
    (acc, [ruleName, ruleFunction]) => ({
      ...acc,
      [ruleName]: (value: string) => {
        if (!value) return true;
        return ruleFunction(value);
      },
    }),
    {},
  );
  return rulesWithEmptyCheck;
};
