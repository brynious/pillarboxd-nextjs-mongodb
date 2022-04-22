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
      // { tmdb_id: 114478, approved_specials: [] }, // Star Wars Visions
      // { tmdb_id: 61118, approved_specials: [] },  // You're the Worst
      // { tmdb_id: 1104, approved_specials: [] }, // Mad Men
      // { tmdb_id: 62611, approved_specials: [] }, // Review
      // { tmdb_id: 8592, approved_specials: [] }, // Parks and Recreation
      // { tmdb_id: 32726, approved_specials: [] }, // Bob's Burgers
      // { tmdb_id: 4608, approved_specials: [] }, // 30 Rock
      // { tmdb_id: 85519, approved_specials: [] }, // The Other Two
      // { tmdb_id: 85702, approved_specials: [] }, // Pen15
      // { tmdb_id: 73107, approved_specials: [] }, // Barry
      // { tmdb_id: 65495, approved_specials: [] }, // Atlanta
      // { tmdb_id: 60059, approved_specials: [] }, // Better Call Saul
      // { tmdb_id: 86340, approved_specials: [] }, // Undone
      // { tmdb_id: 84977, approved_specials: [] }, // Russian Doll
      // { tmdb_id: 63593, approved_specials: [] }, // Documentary Now

      // { tmdb_id: 61175, approved_specials: [] }, // Steven Universe
      // { tmdb_id: 2710, approved_specials: [] }, // It's Always Sunny in Philadelphia
      // { tmdb_id: 69017, approved_specials: [] }, // One Day at a Time
      // { tmdb_id: 61662, approved_specials: [] }, // Schitt's Creek
      // { tmdb_id: 32829, approved_specials: [] }, // Happy Endings
      // { tmdb_id: 10283, approved_specials: [1206544, 1206545, 1206546] }, // Archer
      // { tmdb_id: 61671, approved_specials: [] }, // Unbreakable Kimmy Schmidt
      // { tmdb_id: 15260, approved_specials: [] }, // Adventure Time
      // { tmdb_id: 1435, approved_specials: [] }, // The Good Wife
      // { tmdb_id: 80925, approved_specials: [] }, // Lodge 49
      // { tmdb_id: 42282, approved_specials: [] }, // Girls
      // { tmdb_id: 63248, approved_specials: [] }, // Show Me a Hero
      // { tmdb_id: 33056, approved_specials: [] }, // Childrens Hospital

      // { tmdb_id: 58957, approved_specials: [] }, // Nathan For You
      // { tmdb_id: 48891, approved_specials: [] }, // Brooklyn Nine Nine
      // { tmdb_id: 63161, approved_specials: [] }, // Crazy Ex-Girlfriend
      // { tmdb_id: 1420, approved_specials: [] }, // New Girl
      // { tmdb_id: 79356, approved_specials: [] }, // Tuca & Bertie
      // { tmdb_id: 62649, approved_specials: [] }, // Superstore
      // { tmdb_id: 46648, approved_specials: [] }, // True Detective

      { tmdb_id: 110971, approved_specials: [] }, // How To with John Wilson
    ];

    for (const series of seriesTmdbIds) {
      const tmdb_id = series.tmdb_id;
      const seriesData = await getTmdbApiSeriesData(
        series.tmdb_id,
        series.approved_specials
      );

      // if (seriesData.number_of_episodes > 40) continue;

      if (
        !(
          seriesData.origin_country.includes('GB') ||
          seriesData.origin_country.includes('US')
        )
      )
        continue;

      if (!seriesData.languages.includes('en')) continue;

      if (
        seriesData.episode_run_time.length < 1 ||
        seriesData.episode_run_time[0] < 10
      )
        continue;

      if (seriesData.adult) continue;

      if (seriesData.type === 'Talk Show') continue;

      if (!seriesData.first_air_date) continue;

      console.log(seriesData.name);

      seriesData.slug = await getVerifiedSlug(client, 'tv_series', seriesData);
      const [cast, crew] = await getTmdbSeriesCredits(seriesData.tmdb_id);
      seriesData.cast = cast;
      seriesData.crew = crew;

      const seasons = seriesData.seasons;
      delete seriesData.seasons;

      await upsertObjToDB(client, 'tv_series', seriesData);
      for (const season of seasons) {
        if (season.season_number === 0 && series.approved_specials.length === 0)
          continue;

        const { seasonData, episodes } = await updateSeason(
          client,
          tmdb_id,
          season.season_number
        );

        for (const episode of episodes) {
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
