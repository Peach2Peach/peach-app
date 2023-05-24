import { ReactElement, ReactNode } from 'react'
import { Pressable, View } from 'react-native'
import tw from '../../styles/tailwind'
import { RadioButtonItem } from './RadioButtonItem'

export type RadioButtonItem<T> = {
  value: T
  display: ReactNode
  disabled?: boolean
  data?: any
}

type RadioButtonsProps<T> = ComponentProps & {
  items: RadioButtonItem<T>[]
  selectedValue?: T
  onChange?: (value: T) => void
}

/**
 * @example
 * <RadioButtons
    items={[
      {
        value: true,
        display: <Text>{i18n('yes')}</Text>
      },
      {
        value: false,
        display: <Text>{i18n('no')}</Text>
      }
    ]}
    selectedValue={handsome}
    onChange={(value) => setHandsome(value as boolean)}/>
 */
export const RadioButtons = <T, >({ items, selectedValue, onChange, style }: RadioButtonsProps<T>): ReactElement => (
  <View style={[tw`gap-2`, style]}>
    {items.map((item, i) => (
      <View key={i} style={tw`flex-row items-center`}>
        <Pressable style={tw`w-full`} onPress={() => (onChange && !item.disabled ? onChange(item.value) : null)}>
          <RadioButtonItem display={item.display} selected={item.value === selectedValue} disabled={item.disabled} />
        </Pressable>
      </View>
    ))}
  </View>
)
