import { balticHoneyBadger } from '../../../../tests/unit/data/eventData'
import { mapCountryToDrawerOption } from './mapCountryToDrawerOption'

describe('mapCountryToDrawerOption', () => {
  const onPress = jest.fn()
  const countryEventsMap: CountryEventsMap = {
    LV: [balticHoneyBadger],
    IT: [],
    ES: [],
    FR: [],
    NL: [],
    UK: [],
    SE: [],
    FI: [],
    BE: [],
    DE: [],
  }
  it('map country to drawer option', () => {
    const result = mapCountryToDrawerOption(onPress, countryEventsMap)('LV')
    expect(result).toEqual({
      flagID: 'LV',
      onPress: expect.any(Function),
      title: 'Latvia',
    })

    result.onPress()
    expect(onPress).toHaveBeenCalledWith(countryEventsMap, 'LV')
  })
})
