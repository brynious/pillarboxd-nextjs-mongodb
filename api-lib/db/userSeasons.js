import { ObjectId } from 'mongodb';

export async function getAllUsersSeasons(
  db,
  user_id,
  year,
  before,
  limit = 60
) {
  const ratingsCursor = await db
    .collection('tv_seasons')
    .aggregate([
      {
        $set: {
          year: {
            $year: {
              $dateFromString: {
                dateString: '$air_date',
                format: '%Y-%m-%d',
              },
            },
          },
        },
      },
      {
        $match: {
          year: 2018,
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

      // {
      //   $set: {
      //     // test: 'hello there?',
      //     // year1: {
      //     //   $dateFromString: { dateString: '$air_date', format: '%Y-%m-%d' },
      //     // },
      //     // year2: '$season_data.air_date',
      //     year: {
      //       $year: {
      //         $dateFromString: {
      //           dateString: '$season_data.air_date',
      //           format: '%Y-%m-%d',
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $project: {
          seasonId: 1,
          // userId: 1,
          // ratedAt: 1,
          // score: 1,
          seriesId: '$series_data._id',
          tmdb_id: 1,
          poster_path: 1,
          name: '$series_data.name',
          season_number: 1,
          popularity: '$series_data.popularity',
          series_slug: '$series_data.slug',
          season_slug: 1,
        },
      },
    ])
    .toArray();

  // .aggregate([
  //   {
  //     $set: {
  //       // year: {
  //       //   $dateFromString: { dateString: '$air_date', format: '%Y-%m-%d' },
  //       // },
  //       // year1: '$air_date',
  //       year2: {
  //         $year: {
  //           $dateFromString: {
  //             dateString: '$air_date',
  //             format: '%Y-%m-%d',
  //           },
  //         },
  //       },
  //     },
  //   },
  // {
  //   $lookup: {
  //     from: 'user_series_status',
  //     localField: 'series_id',
  //     foreignField: 'series_id',
  //     as: 'user_series_status',
  //   },
  // },
  // { $unwind: '$user_series_status' },
  // {
  //   $match: {
  //     'user_series_status.user_id': ObjectId(user_id),
  //     $or: [
  //       { 'user_series_status.watchlist': true },
  //       { 'user_series_status.watching': true },
  //       { 'user_series_status.watched': true },
  //     ],
  //     // $eq: [{ $year: '$air_date' }, '2018'],
  //     year: 2018,
  //   },
  // },
  // {
  //   $lookup: {
  //     from: 'tv_series',
  //     localField: 'user_series_status.series_id',
  //     foreignField: '_id',
  //     as: 'series_data',
  //   },
  // },
  // { $unwind: '$series_data' },
  // {
  //   $match: {
  //     ...(before && { 'series_data.popularity': { $lt: before } }),
  //   },
  // },
  // { $sort: { 'series_data.popularity': -1 } },
  // { $limit: limit },
  // {
  //   $project: {
  //     // seasonId: 1,
  //     // userId: 1,
  //     // ratedAt: 1,
  //     // score: 1,
  //     // seriesId: '$series_data._id',
  //     tmdb_id: 1,
  //     poster_path: 1,
  //     // name: '$series_data.name',
  //     // season_number: 1,
  //     popularity: '$series_data.popularity',
  //     series_slug: '$series_data.slug',
  //     season_slug: '$slug',
  //   },
  // },
  // ])
  // .toArray();

  console.log(ratingsCursor[0]);
  console.log(ratingsCursor[0].season_data);

  return ratingsCursor;
}
