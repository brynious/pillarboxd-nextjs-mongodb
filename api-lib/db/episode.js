export async function findEpisodeBySlug(db, series, season, episodeSlug) {
  const episode = await db
    .collection('tv_episodes')
    .findOne({
      series_id: series._id,
      season_id: season._id,
      slug: episodeSlug,
    })
    .then((episode) => episode || null);

  return episode;
}

export async function getEpisodesBySeasonId(db, season_id) {
  const cursor = db.collection('tv_episodes').find(
    { season_id: season_id },
    {
      projection: {
        tmdb_id: 1,
        episode_number: 1,
        guest_stars: 1,
        name: 1,
        overview: 1,
        season_id: 1,
        season_number: 1,
        series_id: 1,
        series_tmdb_id: 1,
        slug: 1,
        still_path: 1,
      },
    }
  );
  const allEpisodes = await cursor.toArray();
  return allEpisodes;
}
