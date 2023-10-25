import { renderHook } from 'test-utils'
import { headerState } from '../../../../tests/unit/helpers/NavigationWrapper'
import { useCreateAccountErrorHeader } from './useCreateAccountErrorHeader'

describe('useCreateAccountErrorHeader', () => {
  it('should set up the header correctly', () => {
    renderHook(useCreateAccountErrorHeader)
    expect(headerState.header()).toMatchSnapshot()
  })
})
