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
  const ratingsCursor = await db
    .collection('series_ratings')
    .aggregate([
      {
        $match: {
          userId: ObjectId(user_id),
          ...(before && { ratedAt: { $lt: before } }),
        },
      },
      { $sort: { score: -1, ratedAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'tv_series',
          localField: 'seriesId',
          foreignField: '_id',
          as: 'seriesData',
        },
      },
      { $unwind: '$seriesData' },
      {
        $project: {
          seriesId: 1,
          userId: 1,
          ratedAt: 1,
          score: 1,
          tmdb_id: '$seriesData.tmdb_id',
          poster_path: '$seriesData.poster_path',
          name: '$seriesData.name',
          slug: '$seriesData.slug',
        },
      },
    ])
    .toArray();

  return ratingsCursor;
}
