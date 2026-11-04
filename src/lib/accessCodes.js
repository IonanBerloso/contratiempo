const ACCESS_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export function generateAccessCode(existingCodes) {
  for (;;) {
    let candidate = "";
    for (let charIndex = 0; charIndex < 4; charIndex++)
      candidate +=
        ACCESS_CODE_ALPHABET[
          Math.floor(Math.random() * ACCESS_CODE_ALPHABET.length)
        ];
    if (!existingCodes.includes(candidate)) return candidate;
  }
}
