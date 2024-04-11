/**
 * 
 * @param {Number} userId 
 * @param {Number} reviewId 
 * @param {*} db 
 * @returns entry in votes database table.
 */
async function getVote(userId, reviewId, db) {
    const query = `SELECT * FROM votes WHERE user_id = $1 AND review_id = $2`
    const values = [userId, reviewId]

    return await db.oneOrNone(query, values)
    .then(vote => {
      return vote
    })
    .catch(err => { // Query Error!
      throw new err
    })
}

/**
 * Creates new entry in votes database table.
 * @param {Number} userId 
 * @param {Number} reviewId 
 * @param {Number} amount 
 * @param {*} db 
 */
async function createVote(userId, reviewId, amount, db) {
    const query = `INSERT INTO votes 
                    (user_id, review_id, vote_amount)
                    VALUES
                    ($1, $2, $3)`;

    const values = [userId, reviewId, amount]
    await db.none(query, values)
        .then(function () {

        })
        .catch(function (err) { // Failed to add user!
            return console.log(err)
        });
}

/**
 * Destroys entry in votes database table.
 * @param {Number} userId 
 * @param {Number} reviewId 
 * @param {*} db 
 */
async function removeVote(userId, reviewId, db) {
    const query = `DELETE FROM votes 
                   WHERE user_id = $1 AND review_id = $2`;

    const values = [userId, reviewId]
    await db.none(query, values)
        .then(function () {

        })
        .catch(function (err) { // Failed to add user!
            return console.log(err)
        });
}

/**
 * Updates vote table with info provided.
 * @param {Number} userId 
 * @param {Number} reviewId 
 * @param {Number} amount 
 * @param {*} db 
 */
async function vote(userId, reviewId, amount, db) {
    const vote = await getVote(userId, reviewId, db)
    if (vote) {
        if (amount == 0) {
            await removeVote(userId, reviewId, db)
            return;
        }
        await removeVote(userId, reviewId, db)
        await createVote(userId, reviewId, amount, db)
    }
    else {
        if (amount == 0) {
            return;
        }
        await createVote(userId, reviewId, amount, db)
    }
}

module.exports = vote