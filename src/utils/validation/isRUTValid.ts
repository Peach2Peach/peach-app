export function isRUTValid(rut: string) {
    const rutMax = 11;
    const rutMagic = 7;
    const rutTen = 10;

    // Step 1: Validate input format
    if (!rut || !/^(\d{1,3}(\.?\d{3})*)-\w$/u.test(rut)) {
        return false;
    }

    // Step 2: Clean and split the RUT
    let [body, checkDigit] = rut.replace(/\./gu, '').split('-');
    if (checkDigit === 'k') checkDigit = 'K'; // Normalize to uppercase if needed

    // Step 3: Calculate expected check digit
    let sum = 0;
    let multiplier = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body[i], rutTen) * multiplier;
        multiplier = (multiplier === rutMagic) ? 2 : multiplier + 1;
    }
    const computedDigit = rutMax - (sum % rutMax);
    let expectedDigit;
    if (computedDigit === rutMax) {
        expectedDigit = '0';
    } else if (computedDigit === rutTen) {
        expectedDigit = 'K';
    } else {
        expectedDigit = computedDigit.toString();
    }

    // Step 4: Compare and return
    return expectedDigit === checkDigit;
}
