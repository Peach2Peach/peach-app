/* eslint-disable no-console */
import { DEV } from '@env'

export const isProduction = () => DEV !== 'true'

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const info = (...args: any[]) => {
  if (!isProduction()) {
    console.info(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const log = (...args: any[]) => {
  if (!isProduction()) {
    console.log(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const trace = (...args: any[]) => {
  if (!isProduction()) {
    console.trace(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const warn = (...args: any[]) => {
  if (!isProduction()) {
    console.warn(new Date(), args)
  }
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const error = (...args: any[]) => {
  console.error(new Date(), args)
}

export default {
  info,
  log,
  trace,
  warn,
  error
}