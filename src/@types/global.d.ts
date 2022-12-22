interface Global {
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
}

declare type AnyObject = {
  [key: string]: any
}

type BitcoinNetwork = 'bitcoin' | 'testnet' | 'regtest'

declare type PaymentData = {
  [key: string]: any
  id: string
  label: string
  type: PaymentMethod
  currencies: Currency[]
  country?: Country
}

declare type PaypalData = {
  phone: string
  email: string
  userName: string
}
declare type SEPAData = {
  beneficiary: string
  iban: string
  bic?: string
  address?: string
  reference?: string
}
declare type BizumData = {
  phone: string
  beneficiary: string
}
declare type MBWayData = {
  phone: string
  beneficiary: string
}
declare type RevolutData = {
  phone: string
  userName: string
  email: string
}
declare type SwishData = {
  phone: string
  beneficiary: string
}
declare type SatispayData = {
  phone: string
}
declare type TwintData = {
  phone: string
  beneficiary: string
}
declare type WiseData = {
  email: string
  phone: string
}
declare type AmazonGiftCardData = {
  email: string
}
declare type CashData = {}

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
  message?: string | null
  readBy: string[]
  signature: string
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
}

declare type MessageLevel = 'OK' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG'
declare type OverlayLevel = 'APP' | 'ERROR' | 'WARN' | 'INFO' | 'DEFAULT' | 'SUCCESS'

declare type MessageState = {
  level: MessageLevel
  msgKey?: string
  action?: Action
  onClose?: Function
  time?: number
  keepAlive?: boolean
}

declare type OverlayState = {
  level?: OverlayLevel
  title?: string
  content?: ReactNode
  action1?: Action
  action2?: Action
  visible: boolean
  requireUserAction?: boolean
}
declare type DrawerState = {
  title: string
  content: ReactNode | null
  show: boolean
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

declare type ContactReason = 'bug' | 'userProblem' | 'question' | 'other' | 'newMethod'

declare type Expiry = {
  date: Date
  ttl: number
  isExpired: boolean
}
