import { ObjectId } from 'mongodb';

export async function getSeriesRating(db, { userId, seriesId }) {
  const dbRating = await db
    .collection('series_ratings')
    .findOne({ userId: ObjectId(userId), seriesId: ObjectId(seriesId) });

  return dbRating;
}

export async function postSeriesRating(db, { userId, seriesId, score }) {
  const dbRating = await db
    .collection('series_ratings')
    .updateOne(
      { userId: userId, seriesId: ObjectId(seriesId) },
      { $set: { score: score, ratedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 }, upsert: true }
    );

  return dbRating.value;
}

export async function deleteSeriesRating(db, { userId, seriesId }) {
  const updatedUser = await db
    .collection('series_ratings')
    .deleteOne({ userId: ObjectId(userId), seriesId: ObjectId(seriesId) });

  return updatedUser.value;
}
