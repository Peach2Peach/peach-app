import { HeaderIcon } from '../../components/header/Header'
import tw from '../../styles/tailwind'

export const headerIcons: Record<string, Omit<HeaderIcon, 'onPress'>> = {
  bitcoin: { id: 'bitcoin', color: tw`text-bitcoin`.color },
  buyFilter: { id: 'filter', color: tw`text-success-main`.color },
  cancel: { id: 'xCircle', color: tw`text-black-3`.color },
  checkbox: { id: 'checkboxMark', color: tw`text-black-2`.color },
  delete: { id: 'trash', color: tw`text-error-main`.color },
  edit: { id: 'edit3', color: tw`text-black-2`.color },
  generateBlock: { id: 'cpu', color: tw`text-warning-main`.color },
  help: { id: 'helpCircle', color: tw`text-info-light`.color },
  list: { id: 'yourTrades', color: tw`text-black-2`.color },
  listFlipped: { id: 'listFlipped', color: tw`text-primary-main`.color },
  percent: { id: 'percent', color: tw`text-primary-main`.color },
  search: { id: 'search', color: tw`text-primary-mild-2`.color },
  sellFilter: { id: 'filter', color: tw`text-primary-main`.color },
  share: { id: 'share', color: tw`text-black-3`.color },
  wallet: { id: 'wallet', color: tw`text-black-2`.color },
  warning: { id: 'alertOctagon', color: tw`text-error-main`.color },
}
