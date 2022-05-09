const axios = require('axios');
const slugify = require('slugify');

const { getVerifiedSlug } = require('./slug');

const findOrCreateSeries = async (client, tmdb_id) => {
  const db_series_obj = await getMongoObjId(client, 'tv_series', tmdb_id);

  if (db_series_obj) {
    // if series already exists in DB, return DB object ID
    return db_series_obj._id;
  } else {
    // if series not in DB, create obj using TMDB API and add to MongoDB
    const seriesObj = await createSeriesObj(client, tmdb_id);
    const db_series_obj_id = await addObjToDB(client, 'tv_series', seriesObj);
    return db_series_obj_id;
  }
};

const getMongoObjId = async (client, collection, tmdb_id) => {
  try {
    const result = await client
      .db('production0')
      .collection(collection)
      .findOne({ tmdb_id: tmdb_id });
    return result;
  } catch (err) {
    console.error(err);
  }
};

const createSeriesObj = async (client, tmdb_id) => {
  const seriesApiData = await getTmdbApiSeriesData(tmdb_id);
  const verifiedSlug = await getVerifiedSlug(
    client,
    'tv_series',
    seriesApiData.slug,
    seriesApiData.origin_country[0],
    new Date(seriesApiData.first_air_date).getFullYear()
  );
  seriesApiData.slug = verifiedSlug;
  const [seriesCast, seriesCrew] = await getTmdbApiSeriesCreditsData(tmdb_id);
  seriesApiData['cast'] = seriesCast;
  seriesApiData['crew'] = seriesCrew;

  return seriesApiData;
};

const getTmdbApiSeriesData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      backdrop_path: data.backdrop_path,
      created_by: data.created_by,
      episode_run_time: data.episode_run_time,
      first_air_date: data.first_air_date,
      homepage: data.homepage,
      in_production: data.in_production,
      languages: data.languages,
      last_air_date: data.last_air_date,
      name: data.name,
      next_episode_to_air: data.next_episode_to_air,
      number_of_episodes: data.number_of_episodes,
      number_of_seasons: data.number_of_seasons,
      origin_country: data.origin_country,
      original_language: data.original_language,
      original_name: data.original_name,
      overview: data.overview,
      popularity: data.popularity,
      poster_path: data.poster_path,
      seasons: data.seasons,
      slug: slugify(data.name, { lower: true, strict: true }),
      spoken_languages: data.spoken_languages,
      status: data.status,
      tagline: data.tagline,
      tmdb_id: data.id,
      type: data.type,
    };
    return seriesProperties;
  } catch (err) {
    console.error(err);
  }
};

const addObjToDB = async (client, collection, newListing) => {
  try {
    console.log('Creating series', newListing.name);
    const result = await client
      .db('production0')
      .collection(collection)
      .insertOne(newListing);
    console.log(
      `New series ${newListing.name} created with the following id: ${result.insertedId}`
    );
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

const getTmdbApiSeriesCreditsData = async (tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
  } catch (err) {
    console.error(err);
  }
};

const getTop100PopularSeries = async () => {
  try {
    let seriesIdArray = [];
    for (let page = 1; page < 6; page++) {
      const resp = await axios.get(
        `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`
      );

      const data = resp.data.results;

      for (const series of data) {
        seriesIdArray.push(series.id);
      }
    }

    return seriesIdArray;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  findOrCreateSeries,
  createSeriesObj,
  getTop100PopularSeries,
};
