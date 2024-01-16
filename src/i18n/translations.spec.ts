import { ok } from 'assert'
import { isDefined } from '../utils/validation/isDefined'
import de from './de'
import elGR from './el-GR'
import en from './en'
import es from './es'
import fr from './fr'
import it from './it'
import sw from './sw'
import tr from './tr'

describe('translations', () => {
  test('non existing texts has not been translated', () => {
    for (const key in es) {
      ok(isDefined(en[key]), `${key} does not exist in en`)
    }
    for (const key in fr) {
      ok(isDefined(en[key]), `${key} does not exist in fr`)
    }
    for (const key in it) {
      ok(isDefined(en[key]), `${key} does not exist in it`)
    }
    for (const key in de) {
      ok(isDefined(en[key]), `${key} does not exist in de`)
    }
    for (const key in elGR) {
      ok(isDefined(en[key]), `${key} does not exist in el-GR`)
    }
    for (const key in tr) {
      ok(isDefined(en[key]), `${key} does not exist in tr`)
    }
    for (const key in sw) {
      ok(isDefined(en[key]), `${key} does not exist in sw`)
    }
  })
})
