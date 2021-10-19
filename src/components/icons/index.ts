import { SvgProps } from 'react-native-svg'
import camera from './camera.svg'
import copy from './copy.svg'
import file from './file.svg'
import send from './send.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  camera,
  copy,
  file,
  send,
}

export default Icons