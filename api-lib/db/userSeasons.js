import { ObjectId } from 'mongodb';

export async function getAllUsersSeasons(
  db,
  user_id,
  year,
  before,
  limit = 60
) {
  const ratingsCursor = await db
    .collection('user_series_status')
    .aggregate([
      {
        // get IDs of series user has marked as watchlist, watching, or watched
        $match: {
          user_id: ObjectId(user_id),
          $or: [{ watchlist: true }, { watching: true }, { watched: true }],
        },
      },
      {
        // match with all seasons for those series
        $lookup: {
          from: 'tv_seasons',
          localField: 'series_id',
          foreignField: 'series_id',
          as: 'season_data',
        },
      },
      { $unwind: '$season_data' },
      {
        // filter to seasons which came out in the specified year
        $match: {
          ...(year && { 'season_data.year': parseInt(year) }),
          'season_data.name': { $ne: 'Specials' },
        },
      },
      {
        $lookup: {
          from: 'tv_series',
          localField: 'series_id',
          foreignField: '_id',
          as: 'series_data',
        },
      },
      { $unwind: '$series_data' },
      { $sort: { 'series_data.popularity': -1 } },
      {
        $match: {
          ...(before && { 'series_data.popularity': { $lt: before } }),
        },
      },
      { $limit: limit },
      {
        $project: {
          seriesId: '$series_data._id',
          tmdb_id: '$season_data.tmdb_id',
          poster_path: '$season_data.poster_path',
          name: '$series_data.name',
          season_number: '$season_data.season_number',
          popularity: '$series_data.popularity',
          series_slug: '$series_data.slug',
          season_slug: '$season_data.slug',
        },
      },
    ])
    .toArray();

  // console.log({ ratingsCursor });

  return ratingsCursor;
}
