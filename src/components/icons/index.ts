import { SvgProps } from 'react-native-svg'
import arrowLeft from './arrowLeft.svg'
import buy from './buy.svg'
import camera from './camera.svg'
import check from './check.svg'
import checkbox from './checkbox.svg'
import circle from './circle.svg'
import clock from './clock.svg'
import copy from './copy.svg'
import cross from './cross.svg'
import dropdownClosed from './dropdownClosed.svg'
import dropdownOpen from './dropdownOpen.svg'
import file from './file.svg'
import fundEscrow from './fundEscrow.svg'
import heart from './heart.svg'
import help from './help.svg'
import money from './money.svg'
import link from './link.svg'
import negative from './negative.svg'
import offers from './offers.svg'
import positive from './positive.svg'
import selectClosed from './selectClosed.svg'
import selectOpen from './selectOpen.svg'
import sell from './sell.svg'
import send from './send.svg'
import settings from './settings.svg'
import sliderNext from './slider-next.svg'
import sliderPrev from './slider-prev.svg'
import triangleRight from './triangleRight.svg'
import triangleUp from './triangleUp.svg'
import undo from './undo.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  arrowLeft,
  buy,
  camera,
  check,
  checkbox,
  circle,
  clock,
  copy,
  cross,
  dropdownClosed,
  dropdownOpen,
  file,
  fundEscrow,
  heart,
  help,
  money,
  link,
  negative,
  offers,
  positive,
  selectClosed,
  selectOpen,
  sell,
  send,
  settings,
  sliderNext,
  sliderPrev,
  triangleRight,
  triangleUp,
  undo,
}

export default Icons