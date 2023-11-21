import { Flags, FlagType } from './flags'
import { PeachText } from './text/Text'

type Props = ComponentProps & { id: FlagType }

export const Flag = ({ id, style }: Props) => {
  const SVG = Flags[id]

  return SVG ? <SVG style={style} /> : <PeachText>❌</PeachText>
}
