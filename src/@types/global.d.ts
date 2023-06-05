interface Global {
  WebSocket: any
  ErrorUtils: {
    setGlobalHandler: any
    reportFatalError: any
    getGlobalHandler: any
  }
}

declare const global: Global

declare type ComponentProps = {
  testID?: string
  forwardRef?: RefObject<unknown>
  children?: ReactNode
  style?: ViewStyle | ViewStyle[]
  onLayout?: (event: LayoutChangeEvent) => void
}

declare type AnyObject = {
  [key: string]: any
}

declare type TradeTab = 'buy' | 'sell' | 'history'

type BitcoinNetwork = 'bitcoin' | 'testnet' | 'regtest'

declare type PaymentCategory = 'bankTransfer' | 'onlineWallet' | 'giftCard' | 'localOption' | 'cryptoCurrency' | 'cash'
declare type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[]
}
declare type LocalPaymentMethods = Partial<Record<Currency, Record<string, PaymentMethod[]>>>

declare type HashedPaymentData = string

declare type Message = {
  roomId: string
  from: User['id']
  date: Date
  message: string
  decrypted?: boolean
  readBy: string[]
  signature: string
  failedToSend?: boolean
}

declare type Chat = {
  id: string
  lastSeen: Date
  messages: Message[]
  draftMessage: string
}

declare type AppState = {
  notifications: number
}

declare type Action = {
  callback: () => void
  label?: string
  icon?: IconType
  disabled?: boolean
}

declare type Level = 'APP' | 'ERROR' | 'WARN' | 'INFO' | 'DEFAULT' | 'SUCCESS'
declare type SummaryItemLevel = Level | 'WAITING'

declare type MessageState = {
  level: Level
  msgKey?: string
  bodyArgs?: string[]
  action?: Action
  onClose?: Function
  time?: number
  keepAlive?: boolean
}

declare type DrawerState = {
  title: string
  content: ReactNode | null
  show: boolean
  previousDrawer: Partial<DrawerState>
  onClose: () => void
}
declare type BitcoinState = {
  currency: Currency
  price: number
  satsPerUnit: number
  prices: Pricebook
}

declare type PeachWallet = {
  wallet: bip32.BIP32Interface
  mnemonic: string
}

declare type ContactReason = 'bug' | 'accountLost' | 'userProblem' | 'question' | 'sellMore' | 'other'

declare type Expiry = {
  date: Date
  ttl: number
  isExpired: boolean
}

declare type Config = {
  paymentMethods: PaymentMethodInfo[]
  peachPGPPublicKey: string
  peachFee: number
  minAppVersion: string
  latestAppVersion: string
  minTradingAmount: number
  maxTradingAmount: number
  hasSeenRedesignWelcome?: boolean
  seenDisputeDisclaimer: boolean
}
