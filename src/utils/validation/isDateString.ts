const dateRegex = /^\d{4}-[01]\d-[0-3]\dT[012]\d(?::[0-6]\d){2}\.\d{3}Z$/u;
export const isDateString = (dateString: string) => dateRegex.test(dateString);
