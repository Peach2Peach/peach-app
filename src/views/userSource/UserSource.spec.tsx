import { fireEvent, render } from 'test-utils'
import { peachAPI } from '../../utils/peachAPI'
import { UserSource } from './UserSource'

describe('UserSource', () => {
  it('renders correctly', () => {
    expect(render(<UserSource />)).toMatchSnapshot()
  })
  it('sumbits the user source on button click', () => {
    const submitSourceSpy = jest.spyOn(peachAPI.private.user, 'submitUserSource')
    const { getByText } = render(<UserSource />)
    const button = getByText('Twitter')
    fireEvent.press(button)

    expect(submitSourceSpy).toHaveBeenCalledWith({ source: 'twitter' })
  })
})
