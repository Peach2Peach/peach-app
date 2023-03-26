
import { ReactElement } from 'react';
import { Text } from '.'
import Flags, { FlagType } from './flags'

type FlagProps = ComponentProps & {
  id: FlagType,
}

/**
 * @description Component to display a flag
 * @param props Component properties
 * @param props.id flag id
 * @param [props.style] css style object
 * @example
 * <Flag id="gb" style={tw`mt-4`} />
 */
export const Flag = ({ id, style }: FlagProps): ReactElement => {
  const SVG = Flags[id]

  return SVG
    ? <SVG style={style}/>
    : <Text>❌</Text>
}

export default Flag