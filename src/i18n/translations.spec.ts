import { ok } from 'assert'
import en from './en'
import es from './es'
import fr from './fr'
import it from './it'
import de from './de'
import { isDefined } from '../utils/validation'

describe('translations', () => {
  test('everything has been translated', () => {
    for (const key in en) {
      ok(isDefined(es[key]), `${key} does not exist in es`)
      ok(isDefined(fr[key]), `${key} does not exist in fr`)
      ok(isDefined(it[key]), `${key} does not exist in it`)
      ok(isDefined(de[key]), `${key} does not exist in de`)
    }
  })
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
  })
})
