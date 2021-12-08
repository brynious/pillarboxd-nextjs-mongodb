const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const tmdb_id = 1396;
    const series_id = await findOrCreateSeries(client, tmdb_id);
    const series_obj = await getMongoObjById(client, 'tv_series', series_id);
    const season_id = await createOrUpdateSeasons(client, series_obj);
    console.log({ season_id });
  } catch (e) {
    console.error(e);
  } finally {
    // await client.close();
  }
}

const getMongoObjById = async (client, collection, mongo_id) => {
  const result = await client
    .db('production0')
    .collection(collection)
    .findOne({ _id: mongo_id });
  return result;
};

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
      slug: slugify(data.name, { lower: true }),
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

const getVerifiedSlug = async (
  client,
  collection,
  defaultSlug,
  country_code,
  premiere_year
) => {
  try {
    // check if there's a series in DB with this slug already
    const slugTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: defaultSlug });
    if (!slugTaken) {
      return defaultSlug;
    }

    // if slug taken, first add country code
    let slugWithCountry = defaultSlug + '-' + country_code.toLowerCase();
    const slugWithCountryTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: slugWithCountry });
    if (!slugWithCountryTaken) {
      return slugWithCountry;
    }

    // if slug taken, first add country code
    let slugWithCountryAndDate = slugWithCountry + '-' + premiere_year;
    const slugWithCountryAndDateTaken = await client
      .db('production0')
      .collection(collection)
      .findOne({ slug: slugWithCountryAndDate });
    if (!slugWithCountryAndDateTaken) {
      return slugWithCountryAndDate;
    }

    // if slug still taken, add next available integer to the end
    let validSlugFound = false;
    let suffix = 1;
    while (!validSlugFound) {
      let slugWithSuffix = slugWithCountryAndDate + '-' + suffix.toString();
      const slugWithSuffixTaken = await client
        .db('production0')
        .collection(collection)
        .findOne({ slug: slugWithSuffix });
      if (!slugWithSuffixTaken) {
        validSlugFound = true;
        return slugWithSuffix;
      } else {
        suffix++;
      }
    }
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

const createOrUpdateSeasons = async (client, series_obj) => {
  const series_tmdb_id = series_obj.tmdb_id;
  series_obj.seasons.forEach(async (season) => {
    const season_number = season.season_number;
    const seasonObj = await getTmdbSeasonData(series_tmdb_id, season_number);
    seasonObj['series_id'] = series_obj._id;
    const [seasonCast, seasonCrew] = await getTmdbSeasonCredits(
      series_tmdb_id,
      season_number
    );
    seasonObj['cast'] = seasonCast;
    seasonObj['crew'] = seasonCrew;

    console.log({ seasonObj });

    const seasonId = await addObjToDB(client, 'tv_season', seasonObj);
    // return seasonId;
  });
};

const getTmdbSeasonCredits = async (series_tmdb_id, season_number) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/season/${season_number}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
  } catch (err) {
    console.error(err);
  }
};

const getTmdbSeasonData = async (series_tmdb_id, season_number) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/season/${season_number}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      air_date: data.air_date,
      episodes: [],
      name: data.name,
      overview: data.overview,
      poster_path: data.poster_path,
      season_number: data.season_number,
      tmdb_id: data.id,
    };
    await data.episodes.forEach((episode) => {
      seriesProperties.episodes.push(episode.episode_number);
    });
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

main().catch(console.error);
