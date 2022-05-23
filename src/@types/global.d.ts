interface Global {
  ErrorUtils: {
    setGlobalHandler: any
    reportFatalError: any
    getGlobalHandler: any
  }
}

declare const global: Global

declare type ComponentProps = {
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
  type: PaymentMethod
}

declare type PaymentCategory = 'bankTransfer' | 'onlineWallet' | 'giftCard' | 'cryptoCurrency'
declare type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[]
}

declare type HashedPaymentData = string

declare type Message = {
  roomId: string,
  from: User['id'],
  date: Date,
  message?: string,
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
  msg: string,
  level: Level,
  time?: number,
}
declare type OverlayState = {
  content: ReactNode,
  showCloseButton: boolean,
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
  peachInfo?: PeachInfo
}

declare type PeachWallet = {
  wallet: bitcoin.bip32.BIP32Interface,
  mnemonic: string
}


declare type ContactReason = 'bug' | 'userProblem' | 'question' | 'other'