import { SvgProps } from 'react-native-svg'
import file from './file.svg'
import send from './send.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  file,
  send
}

export default Icons