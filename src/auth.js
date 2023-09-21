const jsonwebtoken = require("jsonwebtoken");

const secretKey = "mysecretkey";

function generateToken(user) {
  const token = jsonwebtoken.sign(
    { id: user.id, email: user.email },
    secretKey,
    { expiresIn: "1h" }
  );

  return token;
}

function verifyToken(token) {
  try {
    const decoded = jsonwebtoken.verify(token, secretKey);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = {
    generateToken,
    verifyToken
};
