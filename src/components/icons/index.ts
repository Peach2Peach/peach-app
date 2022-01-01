import { SvgProps } from 'react-native-svg'
import arrowLeft from './arrowLeft.svg'
import buy from './buy.svg'
import camera from './camera.svg'
import check from './check.svg'
import circle from './circle.svg'
import copy from './copy.svg'
import dropdownClosed from './dropdownClosed.svg'
import dropdownOpen from './dropdownOpen.svg'
import file from './file.svg'
import offers from './offers.svg'
import selectClosed from './selectClosed.svg'
import selectOpen from './selectOpen.svg'
import sell from './sell.svg'
import send from './send.svg'
import settings from './settings.svg'
import triangleRight from './triangleRight.svg'
import triangleUp from './triangleUp.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  arrowLeft,
  buy,
  camera,
  check,
  circle,
  copy,
  dropdownClosed,
  dropdownOpen,
  file,
  offers,
  selectClosed,
  selectOpen,
  sell,
  send,
  settings,
  triangleRight,
  triangleUp,
}

export default Icons