import crashlytics from '@react-native-firebase/crashlytics'

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const info = (...args: any[]) => {
  console.info([new Date(), 'INFO', ...args].join(' - '))
  crashlytics().log([new Date(), 'INFO', ...args].join(' - '))
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const log = (...args: any[]) => {
  console.log([new Date(), 'LOG', ...args].join(' - '))
  crashlytics().log([new Date(), 'LOG', ...args].join(' - '))
}

/**
 * @description Wrapper method to handle logging
 * @param  {...any} args arguments
 */
export const error = (...args: any[]) => {
  console.log([new Date(), 'ERROR', ...args].join(' - '))
  crashlytics().log([new Date(), 'ERROR', ...args].join(' - '))

  args.filter(arg => arg instanceof Error)
    .forEach(err => crashlytics().recordError(err))
}

export default {
  info,
  log,
  error
}