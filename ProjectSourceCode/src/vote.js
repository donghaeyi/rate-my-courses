async function getVote(userId, reviewId, db) {
    const query = `SELECT * FROM votes WHERE user_id = $1 AND review_id = $2`
    const values = [userId, reviewId]

    return await db.oneOrNone(query, values)
    .then(vote => {
      return vote
    })
    .catch(err => { // Queury Error!
      throw new err
    })
}

module.exports = {getVote}