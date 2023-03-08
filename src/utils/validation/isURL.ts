const urlRegex = /^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/u // eslint-disable-line prefer-named-capture-group, max-len

export const isURL = (url: string) => urlRegex.test(url)
