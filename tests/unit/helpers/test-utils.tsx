import { RenderOptions, render } from '@testing-library/react-native'
import { ReactElement } from 'react'
import { NavigationAndQueryClientWrapper } from './NavigationAndQueryClientWrapper'

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: NavigationAndQueryClientWrapper, ...options })

// re-export everything
export * from '@testing-library/react-native'

// override render method
export { customRender as render }
