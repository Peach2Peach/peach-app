
import React, { ReactNode } from 'react'
import { Shadow, ShadowProps } from 'react-native-shadow-2'

type ShadowPropsFix = React.FC<ShadowProps & {
  children?: ReactNode
}>
export const ShadowFixed: ShadowPropsFix = Shadow

export default ShadowFixed