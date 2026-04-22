import crypto from "crypto"
const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += numbers[crypto.randomInt(numbers.length)];
  }
  return otp;
}
