const statusCodes = require('./statusCodes.js');

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

async function loginRegistration(username, req, res, db) {
    user = await getUserFromDataBase(username, db)
    if (user) {
      login(user, req, res)
    }
    else {
      res.statusCode = statusCodes.QUEURY_ERROR;
      throw new Error("Registration did not add user")
    }
}

// Used by register and login to login.
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