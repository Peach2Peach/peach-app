const MAX_USERNAME_LENGTH = 21;
export const isUsername = (username: string, paymentMethod?: PaymentMethod) => {
  if (username === "@" || username.length > MAX_USERNAME_LENGTH) {
    return false;
  }

  if (paymentMethod === "revolut") {
    return (
      /^@[a-z0-9_]*$/iu.test(username) &&
      username[username.length - 1] !== "_" &&
      username[0] !== "_"
    );
  }

  return /^@[a-z0-9]*$/iu.test(username);
};
