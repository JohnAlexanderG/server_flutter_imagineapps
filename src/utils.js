const pool = require("./database");

async function getUserByToken(token) {
  const _token = token.substr(7);
  const psgQuery = "SELECT * FROM users WHERE token = $1";
  const values = [_token];
  const result = await pool.query(psgQuery, values);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};


module.exports = getUserByToken