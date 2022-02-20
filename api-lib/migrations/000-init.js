const { MongoClient } = require('mongodb');
const axios = require('axios');
const slugify = require('slugify');
const { updateSeason } = require('./000-season');
const { updateEpisode } = require('./000-episode');
const { getVerifiedSlug } = require('../db/tmdb/slug');
require('dotenv').config();

const main = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    const seriesTmdbIds = [
      {
        tmdb_id: 1396, // Breaking Bad
        approved_specials: [62131, 62135],
      },
      {
        tmdb_id: 54344, // Leftovers
        approved_specials: [],
      },
      {
        tmdb_id: 65495, // Atlanta
        approved_specials: [],
      },
      {
        tmdb_id: 42009, // Black Mirror
        approved_specials: [1188308],
      },
      {
        tmdb_id: 18347, // Community
        approved_specials: [],
      },
      {
        tmdb_id: 60574,
        approved_specials: [],
      },
      {
        tmdb_id: 85552,
        approved_specials: [],
      },
      {
        tmdb_id: 110492,
        approved_specials: [],
      },
      {
        tmdb_id: 115036,
        approved_specials: [],
      },
      {
        tmdb_id: 1402,
        approved_specials: [],
      },
      {
        tmdb_id: 456,
        approved_specials: [],
      },
    ];

    for (const series of seriesTmdbIds) {
      const tmdb_id = series.tmdb_id;
      const seriesData = await getTmdbApiSeriesData(
        tmdb_id,
        series.approved_specials
      );
      seriesData.slug = await getVerifiedSlug(client, 'tv_series', seriesData);
      const [cast, crew] = await getTmdbSeriesCredits(seriesData.tmdb_id);
      seriesData.cast = cast;
      seriesData.crew = crew;
      console.log({ seriesData });
      await upsertObjToDB(client, 'tv_series', seriesData);
      for (const season of seriesData.seasons) {
        const seasonData = await updateSeason(
          client,
          tmdb_id,
          season.season_number
        );
        for (const episode of seasonData.episodes) {
          await updateEpisode(
            client,
            tmdb_id,
            season.season_number,
            episode.episode_number,
            series.approved_specials
          );
        }
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log('Client closed');
    client.close();
  }
};

const getTmdbApiSeriesData = async (tmdb_id, approved_specials) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${tmdb_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );
    const data = resp.data;
    const seriesProperties = {
      approved_specials: approved_specials,
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

const getTmdbSeriesCredits = async (series_tmdb_id) => {
  try {
    const resp = await axios.get(
      `https://api.themoviedb.org/3/tv/${series_tmdb_id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const cast = resp.data.cast;
    const crew = resp.data.crew;
    return [cast, crew];
  } catch (err) {
    console.error(err);
  }
};

const upsertObjToDB = async (client, collection, data) => {
  try {
    console.log(`Upserting ${collection} ${data.name}`);
    const result = await client
      .db('production0')
      .collection(collection)
      .updateOne({ tmdb_id: data.tmdb_id }, { $set: data }, { upsert: true });
    return result.insertedId;
  } catch (err) {
    console.error(err);
  }
};

main().catch(console.error);
