import { SvgProps } from 'react-native-svg'
import camera from './camera.svg'
import check from './check.svg'
import circle from './circle.svg'
import copy from './copy.svg'
import dropdownClosed from './dropdownClosed.svg'
import dropdownOpen from './dropdownOpen.svg'
import file from './file.svg'
import triangleUp from './triangleUp.svg'
import send from './send.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  camera,
  check,
  circle,
  copy,
  dropdownClosed,
  dropdownOpen,
  file,
  triangleUp,
  send,
}

export default Icons