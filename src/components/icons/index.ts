import { SvgProps } from 'react-native-svg'
import send from './send.svg'

type Icons = {
  [key: string]: React.FC<SvgProps>
}
const Icons: Icons = {
  send
}

export default Icons