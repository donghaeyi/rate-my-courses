const statusCodes = require('./statusCodes.js');

/** 
 * Handles username length, username, and password check for login post and register post.
 * @param {String} username
 * @param {String} password
 * @param {String} renderPath Which page should be rendered too if account does not meet requirements?
 * @param {*} res
 * @return {Boolean} Returns false if requirements not met, returns true otherwise
*/
function doesAccountMeetRequirements(username, password, renderPath, res) {
  if (username.length > 100) { // Username input too large for database
    let errorMsg = "Enter a username shorter than 100 characters.";
    res.render(renderPath, {username, password, errorMsg});
    res.statusCode = statusCodes.USERNAME_TOO_LARGE;
    return false;
  }
  else if (username.length == 0) { // No username submitted
    let errorMsg = "Enter a username";
    res.render(renderPath, {password, errorMsg});
    res.statusCode = statusCodes.EMPTY_USERNAME;
    return false;
  }
  else if (password.length == 0) { // No password submitted
    let errorMsg = "Enter a password";
    res.render(renderPath, {username, errorMsg});
    res.statusCode = statusCodes.EMPTY_PASSWORD;
    return false;
  }
  return true
}

/**
 * Gets user from database by queurying for username.
 * @param {String} username 
 * @param {*} db 
 * @returns {*} user or undefined
 */
async function getUserFromDataBase(username, db) {
  const query = `SELECT * FROM Users 
                 WHERE
                 $1 = username 
                 LIMIT 1`;
  const values = [username]
  return await db.oneOrNone(query, values)
    .then(user => {
      return user
    })
    .catch(err => { // Queury Error!
      throw new err
    })
}

/**
 * Logs user in, assigns variables from user to req.session.
 * @param {*} user 
 * @param {*} req 
 * @param {*} res 
 */
function login(user, req, res) {
  for (var sessionKey in req.session) {
    for (var userKey in user) {
      if (sessionKey == userKey) {
        sessionKey[sessionKey] = user[userKey]
        break;
      }
    }
  }
  req.session.username = user.username
  res.redirect('home');
}

module.exports = {login, loginRegistration, doesAccountMeetRequirements, getUserFromDataBase}