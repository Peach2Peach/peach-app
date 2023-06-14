import { Fragment, useContext } from 'react'
import { HorizontalLine, PeachScrollView } from '../..'
import { DrawerContext } from '../../../contexts/drawer'
import tw from '../../../styles/tailwind'
import { DrawerOption } from './DrawerOption'

export const DrawerOptions = ({ style }: ComponentProps) => {
  const [{ content, options }] = useContext(DrawerContext)

  return (
    <PeachScrollView style={style} contentContainerStyle={tw`gap-6`}>
      {options.map((option, i) => (
        <Fragment key={`drawer-option-${option}-${i}`}>
          <DrawerOption {...option} />
          <HorizontalLine style={(option.highlighted || options[i + 1]?.highlighted) && tw`bg-primary-mild-1`} />
        </Fragment>
      ))}
      {!options.length && content}
    </PeachScrollView>
  )
}
