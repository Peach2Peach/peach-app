interface Global {
  ErrorUtils: {
    setGlobalHandler: any
    reportFatalError: any
    getGlobalHandler: any
  }
}

declare const global: Global

declare type ComponentProps = {
  testID?: string,
  forwardRef?: RefObject<unknown>,
  children?: ReactNode,
  style?: ViewStyle|ViewStyle[],
}

declare type AnyObject = {
  [key: string]: any
}

type BitcoinNetwork = 'bitcoin' | 'testnet' | 'regtest'

declare type PaymentData = {
  [key: string]: any,
  id: string,
  label: string,
  type: PaymentMethod,
  currencies: Currency[],
}

declare type PaypalData = {
  phone: string,
  email: string,
  userName: string,
}
declare type ApplePayData = {
  phone: string,
}
declare type SEPAData = {
  beneficiary: string,
  iban: string,
  bic?: string,
  address?: string,
  reference?: string,
}
declare type BankTransferCHData = {
  beneficiary: string,
  iban: string,
  address?: string
}
declare type BankTransferUKData = {
  beneficiary: string,
  ukSortCode: string,
  ukBankAccount: string,
  address?: string,
}
declare type BizumData = {
  phone: string,
  beneficiary: string,
}
declare type MBWayData = {
  phone: string,
  beneficiary: string,
}
declare type RevolutData = {
  phone: string,
  userName: string,
  email: string,
}
declare type SwishData = {
  phone: string,
  beneficiary: string,
}
declare type TetherData = {
  tetherAddress: string,
}
declare type TwintData = {
  phone: string,
  beneficiary: string,
}
declare type WiseData = {
  email: string,
  beneficiary: string,
  iban: string,
  bic: string,
}

declare type PaymentCategory = 'bankTransfer' | 'onlineWallet' | 'giftCard' | 'cryptoCurrency'
declare type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[]
}
declare type LocalPaymentMethods = Partial<Record<Currency, Record<string, PaymentMethod[]>>>

declare type HashedPaymentData = string

declare type Message = {
  roomId: string,
  from: User['id'],
  date: Date,
  message?: string|null,
  signature: string,
}

declare type Chat = {
  id: string,
  lastSeen: Date,
  messages: Message[]
}


declare type AppState = {
  notifications: number,
}
declare type MessageState = {
  template?: ReactNode,
  msg?: string,
  level: Level,
  close?: boolean,
  time?: number,
}
declare type OverlayState = {
  content: ReactNode,
  showCloseIcon?: boolean,
  showCloseButton?: boolean,
  help?: boolean,
}
declare type BitcoinState = {
  currency: Currency,
  price: number,
  satsPerUnit: number,
  prices: Pricebook,
}

declare type Session = {
  initialized: boolean
  password?: string,
  notifications: number,
  peachInfo?: PeachInfo,
  unsavedPaymentData?: PaymentData[],
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}


declare type ContactReason = 'bug' | 'userProblem' | 'question' | 'other'