import { ok } from 'assert'
import _en from './en/text.json'
import _es from './es/text.json'
import _fr from './fr/text.json'
import { isDefined } from '../utils/array/isDefined'

const en: Record<string, string> = _en
const es: Record<string, string> = _es
const fr: Record<string, string> = _fr

describe('translations', () => {
  test('everything has been translated', () => {
    for (const key in en) {
      ok(isDefined(es[key]), `${key} does not exist in es`)
      ok(isDefined(fr[key]), `${key} does not exist in es`)
    }
  })
  test('non existing texts has not been translated', () => {
    for (const key in es) {
      ok(isDefined(en[key]), `${key} does not exist in en`)
    }
    for (const key in fr) {
      ok(isDefined(en[key]), `${key} does not exist in en`)
    }
  })
})
