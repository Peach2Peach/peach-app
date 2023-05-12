import { HeaderIcon } from '../../components/header/store'
import tw from '../../styles/tailwind'

export const headerIcons: Record<string, Omit<HeaderIcon, 'onPress'>> = {
  bitcoin: { id: 'bitcoin', color: tw.color('bitcoin') },
  cancel: { id: 'xCircle', color: tw.color('black-3') },
  checkbox: { id: 'checkboxMark', color: tw.color('black-2') },
  delete: { id: 'trash', color: tw.color('error-main') },
  edit: { id: 'edit3', color: tw.color('black-2') },
  help: { id: 'helpCircle', color: tw.color('info-light') },
  list: { id: 'yourTrades', color: tw.color('black-2') },
  wallet: { id: 'wallet', color: tw.color('black-2') },
  warning: { id: 'alertOctagon', color: tw.color('error-main') },
}
