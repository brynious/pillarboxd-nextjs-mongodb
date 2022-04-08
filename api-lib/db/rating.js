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

export async function getSeasonRating(db, { userId, seasonId }) {
  const dbRating = await db
    .collection('season_ratings')
    .findOne({ userId: ObjectId(userId), seasonId: ObjectId(seasonId) });

  return dbRating;
}

export async function postSeasonRating(db, { userId, seasonId, score }) {
  const dbRating = await db
    .collection('season_ratings')
    .updateOne(
      { userId: userId, seasonId: ObjectId(seasonId) },
      { $set: { score: score, ratedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 }, upsert: true }
    );

  return dbRating.value;
}

export async function deleteSeasonRating(db, { userId, seasonId }) {
  const updatedUser = await db
    .collection('season_ratings')
    .deleteOne({ userId: ObjectId(userId), seasonId: ObjectId(seasonId) });

  return updatedUser.value;
}

export async function getEpisodeRating(db, { userId, episodeId }) {
  const dbRating = await db
    .collection('episode_ratings')
    .findOne({ userId: ObjectId(userId), episodeId: ObjectId(episodeId) });

  return dbRating;
}

export async function postEpisodeRating(db, { userId, episodeId, score }) {
  const dbRating = await db
    .collection('episode_ratings')
    .updateOne(
      { userId: userId, episodeId: ObjectId(episodeId) },
      { $set: { score: score, ratedAt: new Date() } },
      { returnDocument: 'after', projection: { password: 0 }, upsert: true }
    );

  return dbRating.value;
}

export async function deleteEpisodeRating(db, { userId, episodeId }) {
  const updatedUser = await db
    .collection('episode_ratings')
    .deleteOne({ userId: ObjectId(userId), episodeId: ObjectId(episodeId) });

  return updatedUser.value;
}

export async function getAllSeriesRatedByUser(db, user_id, before, limit = 60) {
  const ratingsCursor = await db.collection('series_ratings').aggregate([
    {
      $match: {
        userId: ObjectId(user_id),
        ...(before && { ratedAt: { $lt: before } }),
      },
    },
    { $sort: { ratedAt: -1 } },
    { $limit: limit },
  ]);
  const ratingsArray = await ratingsCursor.toArray();

  let ratedSeries = [];

  const unresolved = ratingsArray.map(async (rating) => {
    const _id = await ObjectId(rating.seriesId);

    const seriesCursor = await db.collection('tv_series').findOne(
      { _id },
      {
        projection: {
          name: 1,
          poster_path: 1,
          slug: 1,
          tmdb_id: 1,
        },
      }
    );

    ratedSeries.push({
      _id: rating._id,
      seriesId: rating.seriesId,
      ratedAt: rating.ratedAt,
      score: rating.score,
      tmdb_id: seriesCursor.tmdb_id,
      name: seriesCursor.name,
      poster_path: seriesCursor.poster_path,
      slug: seriesCursor.slug,
    });
  });

  await Promise.all(unresolved);

  ratedSeries.sort((a, b) => {
    if (a.ratedAt < b.ratedAt) {
      return 1;
    } else return -1;
  });

  return ratedSeries;
}
