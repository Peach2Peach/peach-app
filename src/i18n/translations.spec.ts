/* eslint-disable no-console */
import { ok } from 'assert'
import { isDefined } from '../utils/validation'
import de from './de'
import elGR from './el-GR'
import en from './en'
import es from './es'
import fr from './fr'
import it from './it'
import sw from './sw'
import tr from './tr'
import ptBR from './pt-BR'

describe('translations', () => {
  test('warn if not everything has been translated', () => {
    for (const key in en) {
      if (!isDefined(es[key])) console.warn(`${key} does not exist in es`)
      if (!isDefined(fr[key])) console.warn(`${key} does not exist in fr`)
      if (!isDefined(it[key])) console.warn(`${key} does not exist in it`)
      if (!isDefined(de[key])) console.warn(`${key} does not exist in de`)
      if (!isDefined(elGR[key])) console.warn(`${key} does not exist in el-GR`)
      if (!isDefined(tr[key])) console.warn(`${key} does not exist in tr`)
      if (!isDefined(sw[key])) console.warn(`${key} does not exist in sw`)
      if (!isDefined(ptBR[key])) console.warn(`${key} does not exist in pt-BR`)
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
    for (const key in elGR) {
      ok(isDefined(en[key]), `${key} does not exist in el-GR`)
    }
    for (const key in tr) {
      ok(isDefined(en[key]), `${key} does not exist in tr`)
    }
    for (const key in sw) {
      ok(isDefined(en[key]), `${key} does not exist in sw`)
    }
    for (const key in ptBR) {
      ok(isDefined(en[key]), `${key} does not exist in pt-BR`)
    }
  })
})
