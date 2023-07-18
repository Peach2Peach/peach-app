import { Text } from '.'
import { Flags, FlagType } from './flags'

type Props = ComponentProps & { id: FlagType }

export const Flag = ({ id, style }: Props) => {
  const SVG = Flags[id]

  return SVG ? <SVG style={style} /> : <Text>❌</Text>
}
