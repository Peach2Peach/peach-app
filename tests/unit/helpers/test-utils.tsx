import { RenderHookOptions, RenderOptions, render, renderHook } from '@testing-library/react-native'
import { ReactElement } from 'react'
import { CustomWrapper } from './CustomWrapper'

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: CustomWrapper, ...options })

const customRenderHook = <Result, Props>(
  renderCallback: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'>,
) => renderHook<Result, Props>(renderCallback, { wrapper: CustomWrapper, ...options })

// re-export everything
export * from '@testing-library/react-native'

// override render method
export { customRender as render, customRenderHook as renderHook }
