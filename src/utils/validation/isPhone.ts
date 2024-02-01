const phoneRegex = /^\+[1-9][0-9]{7,}$/u;

export const isPhone = (phone: string) => phoneRegex.test(phone);
