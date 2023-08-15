import { balticHoneyBadger } from '../../../../tests/unit/data/eventData'
import { mapCountryToDrawerOption } from './mapCountryToDrawerOption'

describe('mapCountryToDrawerOption', () => {
  const onPress = jest.fn()
  const countryEventsMap = {
    LV: [balticHoneyBadger],
  }
  it('map country to drawer option', () => {
    const result = mapCountryToDrawerOption(onPress, countryEventsMap)('LV')
    expect(result).toEqual({
      flagID: 'LV',
      onPress: expect.any(Function),
      title: 'country.LV',
    })

    result.onPress()
    expect(onPress).toHaveBeenCalledWith(countryEventsMap, 'LV')
  })
})
