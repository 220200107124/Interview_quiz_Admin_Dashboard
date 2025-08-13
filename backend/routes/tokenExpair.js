const crypto = require('crypto');


function generateTokenWithExpiry(size = 16, expiresInMinutes = 45) {
  const token = crypto.randomBytes(size).toString('hex');
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000; // milliseconds

  return { token, expiresAt };
}

const resetToken = generateTokenWithExpiry();
console.log(resetToken);
