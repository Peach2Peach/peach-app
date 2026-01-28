import bs58 from "bs58";
import { isAddress as isEthereumAddress } from "ethers";
import { PaymentMethodField } from "../../../peach-api/src/@types/payment";
import i18n from "../i18n";
import { getMessages } from "./getMessages";
import { isAdvcashWallet } from "./isAdvcashWallet";
import { isBIC } from "./isBIC";
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
const bicValidator = (value: string) => isBIC(value) || getMessages().bic;
const referenceValidator = (value: string) =>
  isValidPaymentReference(value) || getMessages().isValidPaymentReference;
const advcashWalletValidator = (value: string) =>
  isAdvcashWallet(value) || getMessages().advcashWallet;
const emailValidator = (value: string) => isEmail(value) || getMessages().email;
const ethereumAddressValidator = (value: string) => {
  return (
    isEthereumAddress(value.toLowerCase()) ||
    getMessages().ethereumAddressValidator
  );
};

const isSolanaPubKey = (address: string) => {
  try {
    return bs58.decode(address).length === 32;
  } catch {
    return false;
  }
};

const solanaAddressValidator = (value: string) =>
  isSolanaPubKey(value) || getMessages().ethereumAddressValidator;

function isTronAddress(address: string) {
  try {
    const decoded = bs58.decode(address);
    return decoded.length === 25 && address.startsWith("T");
  } catch {
    return false;
  }
}
const tronAddressValidator = (value: string) =>
  isTronAddress(value) || getMessages().ethereumAddressValidator;

const phoneValidator = (value: string) => isPhone(value) || getMessages().phone;
const ukBankAccountValidator = (value: string) =>
  isUKBankAccount(value) || getMessages().ukBankAccount;
const ukSortCodeValidator = (value: string) =>
  isUKSortCode(value) || getMessages().ukSortCode;
const userNameValidator = (value: string) =>
  isUsername(value) || getMessages().userName;
const isPhoneAllowedValidator = (value: string) =>
  isPhoneAllowed(value) || getMessages().isPhoneAllowed;
const minAccountNumberLength = 9;
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
  receiveAddressEthereum: {
    receiveAddressEthereum: ethereumAddressValidator,
  },
  receiveAddressTron: {
    receiveAddressTron: tronAddressValidator,
  },

  receiveAddressSolana: {
    receiveAddressSolana: solanaAddressValidator,
  },
  bankAccountNumber: {},
  bankBranch: {},
  bankName: {},
  beneficiaryAddress: {},
  bsbNumber: {},
  cedulaID: {},
  DNI: {},
  name: {},
  nameTag: {},
  routingDetails: {},
  RUT: {},
  steamFriendCode: {},
  userId: {},
  accountType: {},
  alias: {},
  aliasType: {},
  bankCode: {},
  branchCode: {},
  branchName: {},
  mobileMoneyIdentifier: {},
  residentialAddress: {},
};

export const getValidators = (
  fieldName: PaymentMethodField,
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
