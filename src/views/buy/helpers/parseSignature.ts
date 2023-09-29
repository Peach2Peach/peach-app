const signaturePattern = /[a-zA-Z0-9/=+]{88}/u

export const parseSignature = (signature: string) => signature.match(signaturePattern)?.pop() || signature
