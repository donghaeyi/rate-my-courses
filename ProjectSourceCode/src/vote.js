/**
 * 
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {*} db 
 * @returns entry in votes database table.
 */
async function getVote(user_id, review_id, db) {
    const query = `SELECT * FROM votes WHERE user_id = $1 AND review_id = $2`
    const values = [user_id, review_id]

    return await db.oneOrNone(query, values);
}

/**
 * Creates new entry in votes database table.
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {Number} vote_amount 
 * @param {*} db 
 */
async function createVote(user_id, review_id, vote_amount, db) {
    const query = `INSERT INTO votes 
                    (user_id, review_id, vote_amount)
                    VALUES
                    ($1, $2, $3)`;

    const values = [user_id, review_id, vote_amount]
    await db.none(query, values);
}

/**
 * Destroys entry in votes database table.
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {*} db 
 */
async function deleteVote(user_id, review_id, db) {
    const query = `DELETE FROM votes 
                   WHERE user_id = $1 AND review_id = $2`;

    const values = [user_id, review_id]
    await db.none(query, values);
}

async function modifyVote(user_id, review_id, vote_amount, db) {
    const query = `UPDATE votes 
                   SET
                   vote_amount = $3
                   WHERE
                   user_id = $1 AND
                   review_id = $2`;

    const values = [user_id, review_id, vote_amount]
    await db.none(query, values);
}

/**
 * Updates vote table with info provided.
 * @param {Number} user_id 
 * @param {Number} review_id 
 * @param {Number} vote_amount 
 * @param {*} db 
 */
async function vote(user_id, review_id, vote_amount, db) {
    const vote = await getVote(user_id, review_id, db)
    if (vote === undefined) {
        modifyVote(user_id, review_id, vote_amount, db);
    }
    else {
        createVote(user_id, review_id, vote_amount, db)
    }
}

module.exports = {vote, deleteVote}