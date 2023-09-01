interface Global {
  WebSocket: unknown
  ErrorUtils: {
    setGlobalHandler: unknown
    reportFatalError: unknown
    getGlobalHandler: unknown
  }
}

declare const global: Global

type ComponentProps = {
  testID?: string
  forwardRef?: RefObject<unknown>
  children?: ReactNode
  style?: ViewStyle | ViewStyle[]
  onLayout?: (event: LayoutChangeEvent) => void
}

type AnyObject = {
  [key: string]: unknown
}

type TradeTab = 'buy' | 'sell' | 'history'

type BitcoinNetwork = 'bitcoin' | 'testnet' | 'regtest'

type PaymentCategory = 'bankTransfer' | 'onlineWallet' | 'giftCard' | 'nationalOption' | 'cash' | 'other'
type PaymentCategories = {
  [key in PaymentCategory]: PaymentMethod[]
}
type NationalOptions = Record<'EUR', Record<string, PaymentMethod[]>>

type HashedPaymentData = string

type Message = {
  roomId: string
  from: User['id']
  date: Date
  message: string
  decrypted?: boolean
  readBy: string[]
  signature: string
  failedToSend?: boolean
}

type Chat = {
  id: string
  lastSeen: Date
  messages: Message[]
  draftMessage: string
}

type AppState = {
  notifications: number
}

type Action = {
  callback: () => void
  label?: string
  icon?: IconType
  disabled?: boolean
}

type Level = 'APP' | 'ERROR' | 'WARN' | 'INFO' | 'DEFAULT' | 'SUCCESS'
type SummaryItemLevel = Level | 'WAITING'

type MessageState = {
  level: Level
  msgKey?: string
  bodyArgs?: string[]
  action?: Action
  onClose?: Function
  time?: number
  keepAlive?: boolean
}

type DrawerOptionType = {
  title: string
  subtext?: string
  iconRightID?: IconType
  onPress: () => void
} & (
  | {
      logoID: PaymentLogoType
      flagID?: never
      highlighted?: never
      subtext?: never
    }
  | {
      flagID: FlagType
      logoID?: never
      highlighted?: never
    }
  | {
      flagID?: never
      logoID?: never
      highlighted: boolean
      subtext: string
      iconRightID?: never
    }
  | {
      flagID?: never
      logoID?: never
      highlighted?: never
    }
)

type DrawerState = {
  title: string
  content?: ReactNode | null
  options: DrawerOptionType[]
  show: boolean
  previousDrawer?: DrawerState | undefined
  onClose?: () => void
}
type BitcoinState = {
  currency: Currency
  price: number
  satsPerUnit: number
  prices: Pricebook
}

type PeachWallet = {
  wallet: bip32.BIP32Interface
  mnemonic: string
}

type ContactReason = 'bug' | 'accountLost' | 'userProblem' | 'question' | 'sellMore' | 'other'

type Expiry = {
  date: Date
  ttl: number
  isExpired: boolean
}

type Config = {
  paymentMethods: PaymentMethodInfo[]
  peachPGPPublicKey: string
  peachFee: number
  minAppVersion: string
  latestAppVersion: string
  minTradingAmount: number
  maxTradingAmount: number
  seenDisputeDisclaimer: boolean
  hasSeenGroupHugAnnouncement: boolean
}
