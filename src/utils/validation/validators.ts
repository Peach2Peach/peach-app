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
const userNameRevolutValidator = (value: string) =>
  isUsername(value, "revolut") || getMessages().userName;
const isPhoneAllowedValidator = (value: string) =>
  isPhoneAllowed(value) || getMessages().isPhoneAllowed;
const minAccountNumberLength = 10;
const maxAccountNumberLength = 28;
const accountNumberValidator = (value: string) =>
  isValidDigitLength(value, [minAccountNumberLength, maxAccountNumberLength]) ||
  i18n("form.account.errors");

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
};

const paymentMethodSpecificValidators: {
  [K in PaymentMethod]?: {
    [O in PaymentMethodField]?: NewRule;
  };
} = {
  revolut: {
    userName: {
      userName: userNameRevolutValidator,
    },
  },
};

export type PaymentFieldTypes = keyof typeof validators;

export const getValidators = (
  fieldName: PaymentFieldTypes,
  optional?: boolean,
  paymentMethod?: PaymentMethod,
) => {
  const paymentMethodRulesForField =
    paymentMethod &&
    paymentMethodSpecificValidators[paymentMethod]?.[fieldName];

  const rulesForField = {
    ...validators[fieldName],
    ...paymentMethodRulesForField,
  };

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
