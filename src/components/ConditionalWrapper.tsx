import { ReactElement } from 'react'

type ConditionalWrapperProps = {
  condition: boolean
  wrapper: (children: ReactElement) => ReactElement
  children: ReactElement
}

export const ConditionalWrapper = ({ condition, wrapper, children }: ConditionalWrapperProps): ReactElement =>
  condition ? wrapper(children) : children
