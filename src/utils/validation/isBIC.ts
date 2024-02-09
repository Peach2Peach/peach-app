// eslint-disable-next-line prefer-named-capture-group
const bicRegex = /^[A-Z]{4}\s*[A-Z]{2}\s*[A-Z0-9]{2}\s*([A-Z0-9]{3})?$/u;

export const isBIC = (bic: string) => bicRegex.test(bic);
