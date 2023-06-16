import { Fragment, useContext, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { HorizontalLine, PeachScrollView } from '../..'
import { DrawerContext } from '../../../contexts/drawer'
import tw from '../../../styles/tailwind'
import { DrawerOption } from './DrawerOption'

export const DrawerOptions = ({ style }: ComponentProps) => {
  const [{ content, options }] = useContext(DrawerContext)
  const $scroll = useRef<ScrollView>(null)

  useEffect(() => {
    if (options.length || content) {
      $scroll.current?.scrollTo({ y: 0, animated: false })
    }
  }, [options, content, $scroll])

  return (
    <PeachScrollView style={style} ref={$scroll} contentContainerStyle={tw`gap-6`}>
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
