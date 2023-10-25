import { Fragment, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { shallow } from 'zustand/shallow'
import { HorizontalLine, PeachScrollView } from '../..'
import tw from '../../../styles/tailwind'
import { useDrawerState } from '../useDrawerState'
import { DrawerOption } from './DrawerOption'

export const DrawerOptions = ({ style }: ComponentProps) => {
  const { content, options } = useDrawerState(
    (state) => ({
      content: state.content,
      options: state.options,
    }),
    shallow,
  )
  const $scroll = useRef<ScrollView>(null)

  useEffect(() => {
    if (options.length || content) {
      $scroll.current?.scrollTo({ y: 0, animated: false })
    }
  }, [options, content, $scroll])

  return (
    <PeachScrollView style={style} ref={$scroll} contentStyle={tw`gap-6`}>
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
