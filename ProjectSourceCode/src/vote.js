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
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {Number} amount 
 * @param {*} db 
 */
async function createVote(user_id, review_id, amount, db) {
    const query = `INSERT INTO votes 
                    (user_id, review_id, vote_amount)
                    VALUES
                    ($1, $2, $3)`;

    const values = [user_id, review_id, amount]
    await db.none(query, values)
        .then(function () {

        })
        .catch(function (err) { // Failed to add user!
            return console.log(err)
        });
}

/**
 * Destroys entry in votes database table.
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {*} db 
 */
async function removeVote(user_id, review_id, db) {
    const query = `DELETE FROM votes 
                   WHERE user_id = $1 AND review_id = $2`;

    const values = [user_id, review_id]
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
async function vote(user_id, review_id, amount, db) {
    const vote = await getVote(user_id, review_id, db)
    if (vote) {
        if (amount == 0) {
            await removeVote(user_id, review_id, db)
            return;
        }
        await removeVote(user_id, review_id, db)
        await createVote(user_id, review_id, amount, db)
    }
    else {
        if (amount == 0) {
            return;
        }
        await createVote(user_id, review_id, amount, db)
    }
}

module.exports = vote